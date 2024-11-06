"use strict";

const express = require("express");
const router = express.Router();

router.use("/api", require("./movies"));

router.use("/api", require("./access"));

router.use("/api", require("./users"));


module.exports = router;