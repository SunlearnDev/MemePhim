const express = require('express');
const router = express.Router();

const userController = require('../../controller/user.controller');
const asyncHandler = require('../../helpers/asyncHandler');

router.patch('/auth/update/user/', asyncHandler(userController.UpdateUser));
router.delete('/auth/delete/user/', asyncHandler(userController.UpdateUser));

module.exports = router;
