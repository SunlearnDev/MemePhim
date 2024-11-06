const express = require('express');
const router = express.Router();

const asyncHandler = require('../../helpers/asyncHandler');
const movieController = require('../../controller/movie.controller');

router.get('/movies', asyncHandler(movieController.GetMovie));
router.get('/movies/slug/:slug', asyncHandler(movieController.GetMovieSlug));
router.get('/movies/search/page', asyncHandler(movieController.GetMoviePages));
// router.get('/movies/search', asyncHandler(movieController.GetMovieSearch));
router.get('/movies/new', asyncHandler(movieController.GetMoviePages));


module.exports = router;