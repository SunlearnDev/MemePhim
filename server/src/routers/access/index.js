const express = require('express');
const router = express.Router();

const accessController = require('../../controller/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtlis');
const userController = require('../../controller/user.controller');

// Các route không yêu cầu authentication
router.post('/auth/register', asyncHandler(accessController.Register));
router.post('/auth/login', asyncHandler(accessController.Login));
router.get('/user/:id/', asyncHandler(userController.GetUser));
// Các route yêu cầu authentication
router.use(authentication);
router.patch('/auth/changepassword', asyncHandler(accessController.ChangePassword));
router.delete('/auth/delete/devices', asyncHandler(accessController.delAlldevices));
router.post('/auth/logout', asyncHandler(accessController.Logout));

module.exports = router;
