"use strict";
const MovieService = require("../services/movie.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.respone");

class CawlerMoviesController {
  static async GetMovieSlug(req, res, next) {
    const { data, message } = await MovieService.findMovieBySlug(
      req.params
    );
    new SuccessResponse({
        message: "message",
        metadata: {
            data
        }
    }).send(res);
  }
  static async GetMovie(req, res, next) {
    const { data } = await MovieService.getMovieAll();
    new SuccessResponse({
        message: "Movie fetched successfully",
        metadata: {
            data
        }
    }).send(res);
  }
  static async GetMoviePages(req, res, next) {
    const { page, limit } = req.query;
    const { data } = await MovieService.getMoviesPages({ page, limit } );
    new SuccessResponse({
        message: "Movie fetched successfully",
        metadata: {
            data
        }
    }).send(res);
  }
  static async GetMovieSearch(req, res, next) {
    const { keyword, limit = 10, category, country, year } = req.query;
    const { data } = await MovieService.getMoviesPages({ keyword, limit, category, country, year } );
    new SuccessResponse({
        message: "Movie fetched successfully",
        metadata: {
            data
        }
    }).send(res)
  }
  static async GetslugetMoviesByCategory(req, res, next) {
    const { page } = req.query;
    const { slug } = req.params;  
    const { data } = await MovieService.getMoviesByCategory({ slug, page} );
    new SuccessResponse({
        message: "Movie fetched successfully",
        metadata: {
            data
        }
    }).send(res);
  }
  static async GetslugetMoviesByCountry(req, res, next) {
    const { page } = req.query;
    const { slug } = req.params;  
    const { data } = await MovieService.getMoviesByCountry({ slug, page} );
    new SuccessResponse({
        message: "Movie fetched successfully",
        metadata: {
            data
        }
    }).send(res);
  }
}

module.exports = CawlerMoviesController;
