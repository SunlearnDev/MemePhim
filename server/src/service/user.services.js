'use strict';
const { User } = require('../models/index');   
const getInfo = require("../utils");

const findByEmail = async ({ email, select = ['id', 'email', 'username', 'password', 'salt', 'type', 'role'] }) => {
    try {
        // Kiểm tra giá trị của select, đảm bảo nó là một mảng
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
                user: getInfo({fields: ["id", "email", "username","type"], data: user})
            }
        };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findByEmail,
    getUser,
};
