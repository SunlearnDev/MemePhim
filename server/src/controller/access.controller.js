"use strict";
const AccessService = require("../service/access.services");
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

  static async Register(req, res, next) {
    const result = await AccessService.Register(req.body);
    new CREATED({
      message: "Đăng ký thành công",
      metadata: result.metadata,
    }).send(res);
  }
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
}
module.exports = AccessController;
