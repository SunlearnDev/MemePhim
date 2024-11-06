"use strict";

const { Movie } = require("../models/index");
const EpisodeService = require("./episode.service");
const CategoryService = require("./category.service");
const CountryService = require("./country.sevice");
const TmdbService = require("./tmdb.service");
class MoviesService {
  // Private helper method để kiểm tra tồn tại của movie
  static async #checkMovieExists(id) {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      throw new Error(`Movie with id ${id} not found`);
    }
    return movie;
  }

  // Private helper method để xử lý các relationships
  static async #handleRelationships(
    movie,
    { episodes, categories, countries }
  ) {
    const promises = [
      ...(categories?.map((category) =>
        CategoryService.createCategory(category, movie._id)
      ) || []),
      ...(countries?.map((country) =>
        CountryService.createCountry(country, movie._id)
      ) || []),
      ...(episodes?.map((episode) =>
        EpisodeService.createEpisodes(episode, movie._id)
      ) || []),
    ];
    await Promise.all(promises);
  }
  static async #paginationMovie({ page, limit } = {}) {
    const totalItems = await Movie.count();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
      },
    };
  }

  static async findIdMovies(id) {
    try {
      return await Movie.findByPk(id);
    } catch (error) {
      throw new Error(`Error finding movie: ${error.message}`);
    }
  }
  static async getMovieAll() {
    try {
      const movieAll = await Movie.findAll({
        order: [["createdAt", "DESC"]],
      });
      return {
        data: movieAll,
        message: "Success",
      };
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }

  static async getMoviesPages({ page = 1, limit = 10, ...queryOptions } = {}) {
    try {
      const offset = (page - 1) * limit;
      const pagination = await this.#paginationMovie({ page, limit });
      const limitt = parseInt(limit, 10) || 10;
      const moviePages = await Movie.findAndCountAll({
        ...queryOptions,
        limitt,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        data: {
          movies: moviePages.rows,
          pagination,
        },
      };
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }
  static async getMoviesSearch({keyword, limit, ...queryOptions} = {}) {
    try {
      const offset = (page - 1) * limit;
      const pagination = await this.#paginationMovie({ page, limit });
      const limitt = parseInt(limit, 10) || 10;
      const moviePages = await Movie.findAndCountAll({
        ...queryOptions,
        limitt,
        offset,
        order: [["createdAt", "DESC"]],
      });
      
      return {
        data: {
          movies: moviePages.rows,
          pagination,
        },
      };
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }
  static async findMovieSlug({
    slug,
    select = [
      "_id",
      "name",
      "slug",
      "origin_name",
      "content",
      "type",
      "status",
      "poster_url",
      "thumb_url",
      "is_copyright",
      "sub_docquyen",
      "chieurap",
      "trailer_url",
      "time",
      "episode_current",
      "episode_total",
      "quality",
      "lang",
      "notify",
      "showtimes",
      "year",
      "view",
    ],
  }) {
    try {
      if (!Array.isArray(select)) {
        throw new Error("Chưa chọn thuộc tính cần lấy");
      }

      const movie = await Movie.findOne({
        where: { slug: slug },
        attributes: select,
      });
      return movie;
    } catch (error) {
      throw error;
    }
  }
  static async getslug({ slug }) {
    try {
      const movieSlug = await this.findMovieSlug({
        slug,
        select: [
          "_id",
          "name",
          "slug",
          "origin_name",
          "content",
          "type",
          "status",
          "poster_url",
          "thumb_url",
          "is_copyright",
          "sub_docquyen",
          "chieurap",
          "trailer_url",
          "time",
          "episode_current",
          "episode_total",
          "quality",
          "lang",
          "notify",
          "showtimes",
          "year",
          "view",
        ],
      });
      if (!movieSlug) {
        return {
          data: null,
          message: "Slug not found",
        };
      }
      const episodes = await EpisodeService.getEpisodeMovie(movieSlug._id);
      const categories = await CategoryService.getCategoryMoive(movieSlug._id);
      return {
        data: {
          movie: {
            movieSlug,
            category: categories,
          },
          episodes,
        },
        message: "Success",
      };
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }

  static async getMovieDetail(movieId) {
    try {
      const movie = await Movie.findByPk(movieId, {
        include: ["episodes", "categories", "countries"],
      });

      if (!movie) {
        throw new Error("Movie not found");
      }

      return movie;
    } catch (error) {
      throw new Error(`Error fetching movie details: ${error.message}`);
    }
  }

  static async createMovie(episodes = [], data) {
    try {
      // Kiểm tra movie đã tồn tại
      const existingMovie = await this.findIdMovies(data._id);

      if (existingMovie) {
        const updatedMovie = await this.updateMovie(data._id, data);
        return updatedMovie;
      }

      // Tạo movie mới trong transaction
      const newMovie = await Movie.create(data);

      if (!newMovie) {
        throw new Error("Failed to create movie");
      }

      // Xử lý các relationships
      await this.#handleRelationships(newMovie, {
        categories: data.category,
        countries: data.country,
        episodes,
      });
      // await TmdbService.createTmdb(data.tmdb, newMovie._id);

      return newMovie;
    } catch (error) {
      throw new Error(`Error creating movie: ${error.message}`);
    }
  }

  static async updateMovie(movieId, data) {
    try {
      // Kiểm tra movie tồn tại
      await this.#checkMovieExists(movieId);

      // Update movie
      await Movie.update(data, {
        where: { _id: movieId },
        returning: true,
      });

      return await this.getMovieDetail(movieId);
    } catch (error) {
      throw new Error(`Error updating movie: ${error.message}`);
    }
  }

  static async deleteMovie(movieId) {
    try {
      const movie = await this.#checkMovieExists(movieId);

      // Xóa các relationships trước
      await Promise.all([
        EpisodeService.deleteEpisodesByMovieId(movieId),
        CategoryService.deleteCategoriesByMovieId(movieId),
        CountryService.deleteCountriesByMovieId(movieId),
      ]);

      await movie.destroy();
      return { message: "Movie deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting movie: ${error.message}`);
    }
  }
}

module.exports = MoviesService;
