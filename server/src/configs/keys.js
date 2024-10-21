"use strict";
/* dùng node keys.js để tạo keywords publicKey, privateKey */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const publicKeyPEM = publicKey
  .export({ format: "pem", type: "spki" })
  .toString();
const privateKeyPEM = privateKey
  .export({ format: "pem", type: "pkcs8" })
  .toString();

const keysDir = path.join(__dirname, "../../../server/.env");

const envFile = `
PUBLIC_KEY=${publicKeyPEM.replace(/\n/g, '\\n')}
PRIVATE_KEY=${privateKeyPEM.replace(/\n/g, '\\n')}
`;

if (fs.existsSync(keysDir)) {
  const currentKeys = fs.readFileSync(keysDir, "utf8");
  if (
    currentKeys.includes("PUBLIC_KEY") &&
    currentKeys.includes("PRIVATE_KEY")
  ) {
    console.log("Keys đã tồn tại");
  } else {
    fs.appendFileSync(keysDir, envFile, { encoding: "utf8" });
    console.log("Keys đã được tạo thành công");
  }
} else {
  fs.appendFileSync(keysDir, envFile, { encoding: "utf8" });
  console.log("Keys đã được tạo thành công");
}
