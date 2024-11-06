'use strict';
const { User } = require('../models/index');   
const getInfo = require("../utils");
const {
    BadRequest,
    AuthFailure,
    ForbiddenError,
    ConflictRequestError,
  } = require("../core/error.respone");
const findByEmail = async ({ email, select = ['id', 'email', 'username', 'password', 'salt', 'type', 'role'] }) => {
    try {
        if (!Array.isArray(select)) {
            throw new Error("Chưa chọn thuộc tính cần lấy");
        }

        const user = await User.findOne({ 
            where: { email: email },
            attributes: select
        });
        return user;
    } catch (error) {
        throw error;
    }
}
const getUser = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'email', 'username', 'type']
        });
        return {
            metadata:{
                user: getInfo({fields: ["id", "email", "username", "type"], data: user})
            }
        };
    } catch (error) {
        throw error;
    }
}
const updateUser = async ({userId, data}) => {
    try {
        const user = getUser(userId);
        if (!user) throw new BadRequest("Người dùng không tồn tại");
        const updatedUser = await User.update(data,{
            where: { id: userId },
            returning: true,
            plain: true,
        });
        if (updatedUser === 0) throw new ForbiddenError("Update failed.");

        return {
            metadata: {
                user: getInfo({ fields: ["id", "email", "username", "type"], data: user }),
            },
        };
    } catch (error) {
        throw error;
    }
}
const deleteUser = async (userId) => {
    try {
        const user = getUser(userId);
        if (!user) throw new BadRequest("Người dùng không tồn tại");
        await User.destroy();
        return {
            message: "Người dùng đã được xóa thành công",
        };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findByEmail,
    getUser,
    updateUser,
    deleteUser,
};
