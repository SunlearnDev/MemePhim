"use strict";

const JWT = require('jsonwebtoken');
const asyncHandler = require("../helpers/asyncHandler");
const { BadRequest, AuthFailure } = require("../core/error.respone");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
  path: path.join(__dirname, "../../../server/.env"),
});
const HEADER = {
  USER_ID: "user_id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "refresh_token"
};

const CreateTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(
      payload,
      publicKey,
      { expiresIn: "5h" }
    );
    const refreshToken = JWT.sign(
      payload,
      privateKey,
      { expiresIn: "7d" }
    );
    return { accessToken, refreshToken };
  } catch (err) {
    throw new BadRequest(err);
  }
};

const ReAccessToken = async (payload, publicKey) => {
  try {
    return JWT.sign(
      payload,
      publicKey,
      { expiresIn: "5h" }
    );
  } catch (err) {
    throw new BadRequest("Error creating token pair");
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.USER_ID];
  if (!userId) {
    throw new AuthFailure("Vui lòng đăng nhập để tiếp tục.");
  }
  const refreshToken = req.cookies.refreshToken;
  const authorizationHeader = req.headers[HEADER.AUTHORIZATION];
  if (authorizationHeader) {
    await handleAccessToken(req, userId, authorizationHeader, next);
  } else if (refreshToken) {
    await handleRefreshToken(req, userId, refreshToken, next);
  } else {
    throw new AuthFailure("Token không được cung cấp.");
  }
});

async function handleRefreshToken(req, userId, refreshToken, next) {
  const keyStore = await KeyToken.GetToken(userId);
  if (!keyStore) {
    throw new AuthFailure(
      "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
    );
  }
  try {
    const decodeUser = verifyJWT(refreshToken, process.env.PRIVATE_KEY);
    if (!decodeUser || decodeUser.userId !== userId) {
      throw new AuthFailure(
        "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
      );
    }
    req.userId = userId;
    req.user = decodeUser;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    
    next(
      new AuthFailure("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
    );
  }
}

async function handleAccessToken(req, userId, authorizationHeader, next) {
  try {
    if (authorizationHeader) {
      const accessToken = authorizationHeader.startsWith("Bearer ")
        ? authorizationHeader.slice(7).trim()
        : authorizationHeader;
      const decode = verifyJWT(accessToken, process.env.PUBLIC_KEY);
      if (decode.userId !== userId) {
        throw new AuthFailure(
          "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại."
        );
      }
    }
    req.userId = userId;
    next();
  } catch (error) {
    
    next(
      new AuthFailure("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
    );
  }
}

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = { CreateTokenPair, authentication, verifyJWT, ReAccessToken };
