"use strict";
const UserService = require("../services/user.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.respone");

class UserController {
    static async UpdateUser(req, res, next) {
        const data = req.body;
        const { metadata } = await UserService.updateUser({
            userId: req.userId,
            data: data 
        });
        new SuccessResponse({
            message: "User updated successfully",
            metadata: {
                metadata,
            },
        }).send(res);
    }
    static async GetUser(req, res, next) {
        const { metadata } = await UserService.getUser(req.params.id);
        new SuccessResponse({
            message: "User fetched successfully",
            metadata: {
                metadata,
            },
        }).send(res);
    }
    static async DeleteUser(req, res, next) {
        await UserService.deleteUser({
            user: req.user
        });
        new OK().send(res);
    }
}

module.exports = UserController;