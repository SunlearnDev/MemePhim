const express = require('express');
const router = express.Router();

const userController = require('../../controller/user.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const movieController = require('../../controller/movie.controller');


router.patch('/auth/update/user/', asyncHandler(userController.UpdateUser));
router.delete('/auth/delete/user/', asyncHandler(userController.UpdateUser));
router.get('/auth/history', asyncHandler(movieController.HistoryMovies));
router.port('/auth/history', asyncHandler(movieController.HistoryMovie));

router.get('/auth/save/movie', asyncHandler(movieController.SaveMovies));
router.port('/auth/save/move', asyncHandler(movieController.SaveMovie));


module.exports = router;
