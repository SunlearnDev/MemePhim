"use strict";
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
  path: path.join(__dirname, "../../../server/.env"),
});
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { findByEmail } = require("./user.service");
const UserDevicesService = require("./userDevices.services");
const UserDeviceAssignmentsService = require("./userDeviceAssignments.service");
const getInfo = require("../utils/index");
const {
  BadRequest,
  AuthFailure,
  ForbiddenError,
  ConflictRequestError,
} = require("../core/error.respone");
const { getDeviceInfo, getstring } = require("../utils/device");
const {
  CreateTokenPair,
  verifyJWT,
  ReAccessToken,
} = require("../auth/authUtlis");
const sequelize = require("../configs/configs.mysql");
class AccessService {
  static async HandRefreshToken({ keyStore, user, refreshToken }) {
    const userId = user.userId;
    const email = user.email;

    if (keyStore.refreshTokensUser.includes(refreshToken)) {
      await KeyToken.deleteRefreshToken(userId);
      throw new ForbiddenError(
        "Có lỗi xảy ra khi xác thực vui lòng đăng nhập lại"
      );
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new ForbiddenError(
        "Có lỗi xảy ra khi xác thực vui lòng đăng nhập lại"
      );
    }

    const tokens = await CreateTokenPair(
      { userId: user.userId, email: user.email },
      process.env.PUBLIC_KEY,
      process.env.PRIVATE_KEY
    );

    if (!tokens) {
      throw new ForbiddenError(
        "Có lỗi xảy ra khi xác thực vui lòng đăng nhập lại"
      );
    }

    await KeyToken.Update(userId, tokens.refreshToken, keyStore.refreshToken);

    return {
      metadata: {
        user: getInfo({ fields: ["userId", "email"], data: user }),
      },
      tokens,
    };
  }
  static async HandReAccessToken({ refreshToken }) {
    const key = await KeyToken.findByRefreshToken(refreshToken);
    if (!key) {
      throw new ForbiddenError(
        "Refresh token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại."
      );
    }
    const { userId, email } = await verifyJWT(refreshToken, key.privateKey);
    const checkUser = await findByEmail({
      email: email,
      select: ["id", "email", "username", "role"],
    });
    if (!checkUser) {
      throw new ForbiddenError(
        "Người dùng không tồn tại hoặc đã bị xóa. Vui lòng đăng nhập lại."
      );
    }
    const tokens = await ReAccessToken(
      {
        userId: checkUser.id,
        email: checkUser.email,
        username: checkUser.username,
        role: checkUser.role,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.PUBLIC_KEY
    );
    return {
      tokens,
    };
  }

  static async Register({ username, email, password }) {
    try {
      const user = await User.findOne({ where: { email: email } });
      if (user) throw new ConflictRequestError("Email đã tồn tại");

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password + salt, 10);

      const newUser = await User.create({
        username,
        email,
        password: passwordHash,
        salt,
      });
      if (!newUser) throw new AuthFailure("Đã có lỗi xảy ra khi tạo tài khoản");

      return {
        metadata: {
          newUser: getInfo({
            fields: ["id", "username", "email"],
            data: newUser,
          }),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async ChangePassword({ userId, oldPassword, newPassword }) {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new BadRequest("Người dùng không tồn tại");
      const isMatch = await bcrypt.compare(
        oldPassword + user.salt,
        user.password
      );
      if (!isMatch) throw new BadRequest("Mật khẩu không đúng");
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword + salt, 10);
      await User.update(
        { password: passwordHash, salt },
        { where: { id: userId } }
      );
      return {
        message: "Mật khẩu đã được thay đổi thành công",
      };
    } catch (error) {
      throw error;
    }
  }

  static async Logout(userId, deviceId) {
    try {
      const device = await getDeviceInfo({ deviceId });
      const deviceString = await getstring({
        browser: device.browser,
        os: device.os,
        device: device.device,
      });
      return await UserDevicesService.deleteUserDevices(userId, deviceString);
    } catch (err) {
      throw err;
    }
  }

  static async Login({ email, password, remember, deviceId }) {
    const transaction = await sequelize.transaction();
    try {
      // check email and password
      const usercheck = await this.validateUser(email, password);
      // check login limit
      await this.checkLoginLimit(usercheck.id);
      // check device
      const device = await getDeviceInfo({ deviceId }, { transaction });

      if (remember === false) return this.handleShortTermLogin(user);

      const user = await this.handleLongTermLogin(usercheck, device, {
        transaction,
      });
      await transaction.commit();
      return user;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  static async validateUser(email, password) {
    const user = await findByEmail({
      email,
      select: ["id", "email", "username", "role", "password", "salt"],
    });
    if (!user) throw new AuthFailure("Email hoặc mật khẩu không đúng");

    const isMatch = await bcrypt.compare(password + user.salt, user.password);
    if (!isMatch) throw new AuthFailure("Email hoặc mật khẩu không đúng");

    return user;
  }

  static async checkLoginLimit(userId) {
    const countLogin =
      await UserDeviceAssignmentsService.getUserDeviceAssignments(userId);
    if (countLogin.length >= 3) {
      throw new AuthFailure("Tài khoản đã đăng nhập trên 3 thiết bị");
    }
  }

  static async handleShortTermLogin(user) {
    const createToken = await ReAccessToken(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.PUBLIC_KEY
    );
    return {
      metadata: {
        user: getInfo({ fields: ["id", "email", "username"], data: user }),
      },
      createToken,
      remember: false,
    };
  }

  static async handleLongTermLogin(user, device) {
    const createToken = await CreateTokenPair(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        deviceId: device,
      },
      process.env.PUBLIC_KEY,
      process.env.PRIVATE_KEY
    );

    if (!createToken) {
      throw new ConflictRequestError(
        "Đã có lỗi xảy ra khi đăng nhập tài khoản"
      );
    }
    const deviceId = await getstring({
      browser: device.browser,
      os: device.os,
      device: device.device,
    });
    const key = await UserDevicesService.createUserDevices({
      deviceId: deviceId,
      token: createToken.refreshToken,
    });
    await UserDeviceAssignmentsService.createUserDeviceAssignments(
      user.id,
      key.id
    );
    if (!key) {
      throw new ConflictRequestError(
        "Đã có lỗi xảy ra khi đăng nhập tài khoản"
      );
    }

    return {
      metadata: {
        user: getInfo({ fields: ["id", "email", "username"], data: user }),
      },
      createToken,
      remember: true,
    };
  }
  static async DelAllDevices(userId) {
    try{
      const userDevices = await UserDeviceAssignmentsService.getUserDeviceAssignments(userId);
      if(userDevices.length === 0) throw new BadRequest("Người dùng không có thiết bị nào");
      const userDevicesId = userDevices.map((item) => item.userDeviceId);
      await UserDevicesService.deleteUserIdDevices(userDevicesId);
      return {
        message: "Xóa tất cả thiết bị thành công",
      };
    }
    catch(error){
      throw error;
    }
  }
}
module.exports = AccessService;
