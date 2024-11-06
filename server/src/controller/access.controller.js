"use strict";
const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.respone");
class AccessController {
  static async HandRefreshToken(req, res, next) {
    const { metadata, tokens } = await AccessService.HandRefreshToken({
      keyStore: req.keyStore,
      refreshToken: req.refreshToken,
      user: req.user,
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    new SuccessResponse({
      message: "Refresh token successfully",
      metadata: {
        metadata,
        tokens: tokens.accessToken,
      },
    }).send(res);
  }
  static async HandReAccessToken(req, res, next) {
    return new SuccessResponse({
      message: "ReAccessToken successfully",
      metadata: await AccessService.HandReAccessToken({
        refreshToken: req.refreshToken,
      }),
    }).send(res);
  }
  /**
   * @swagger
   * /api/register:
   *   post:
   *     summary: Đăng ký người dùng
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - username
   *               - password
   *     responses:
   *       201:
   *         description: Đăng ký thành công
   *       400:
   *         description: Thông tin không hợp lệ
   */
  static async Register(req, res, next) {
    const result = await AccessService.Register(req.body);
    new CREATED({
      message: "Đăng ký thành công",
      metadata: result.metadata,
    }).send(res);
  }
  /**
   * @swagger
   * /api/login:
   *   post:
   *     summary: Đăng nhập người dùng
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *               remember:
   *                 type: boolean
   *             required:
   *               - username
   *               - password
   *     responses:
   *       200:
   *         description: Đăng nhập thành công
   *       401:
   *         description: Thông tin đăng nhập không hợp lệ
   */
  static async Login(req, res, next) {
    const { metadata, createToken, remember } = await AccessService.Login(
      req.body
    );

    if (remember)
      res.cookie("refreshToken", createToken.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    new SuccessResponse({
      message: "Đăng nhập thành công",
      metadata: {
        user: metadata.user,
        tokens: createToken || createToken.accessToken,
        remember,
      },
    }).send(res);
  }
  static async Logout(req, res, next) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0,
    });
    new OK({
      message: "Đăng xuất thành công",
      metadata: await AccessService.Logout(req.userId),
    }).send(res);
  }
  static async ChangePassword(req, res, next) {
    const { metadata } = await AccessService.ChangePassword({
      userId: req.userId,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    });
    new SuccessResponse({
      message: "Đổi mật khẩu thành công",
      metadata,
    }).send(res);
  }

  static async delAlldevices(req, res, next) {
    const { metadata } = await AccessService.DelAllDevices(req.userId);
    new SuccessResponse({
      message: "Xóa tất cả thiết bị đăng nhập thành công",
      metadata,
    }).send(res);
  }
}
module.exports = AccessController;
