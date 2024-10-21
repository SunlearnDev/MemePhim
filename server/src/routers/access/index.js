const express  = require('express');
const router = express.Router();

const accessController = require('../../controller/access.controller');
const asynHandler = require('../../helpers/asyncHandler');
const {authentication} = require('../../auth/authUtlis');

router.post('auth/register', asynHandler(accessController.Register));
router.post('auth/login', asynHandler(accessController.Login));

router.use(authentication);
router.post('auth/logout', asynHandler(accessController.Logout));

module.exports = router;