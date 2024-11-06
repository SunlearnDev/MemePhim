"use strict";

const { Movie, Category, Country } = require("../models/index");
const EpisodeService = require("./episode.service");
const CategoryService = require("./category.service");
const CountryService = require("./country.sevice");
const TmdbService = require("./tmdb.service");

// Constants
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_MOVIE_ATTRIBUTES = [
  "_id", "name", "slug", "origin_name", "content", "type", "status",
  "poster_url", "thumb_url", "is_copyright", "sub_docquyen", "chieurap",
  "trailer_url", "time", "episode_current", "episode_total", "quality",
  "lang", "notify", "showtimes", "year", "view"
];

// Utility functions for reuse
const PaginationHelper = {
  calculateOffset: (page, limit) => (page - 1) * limit,
  
  async calculatePagination(totalItems, page, limit) {
    const totalPages = Math.ceil(totalItems / limit);
    return {
      currentPage: page,
      totalPages,
      totalItems,
    };
  }
};

class MovieQueryBuilder {
  static buildBaseQuery(options = {}) {
    return {
      ...options,
      order: [["createdAt", "DESC"]]
    };
  }

  static buildPaginatedQuery(page, limit, extraOptions = {}) {
    const offset = PaginationHelper.calculateOffset(page, limit);
    return {
      ...this.buildBaseQuery(extraOptions),
      limit: parseInt(limit, 10) || DEFAULT_PAGE_SIZE,
      offset
    };
  }

  static buildCategoryQuery(slug, limit, offset) {
    return {
      include: [{
        model: Category,
        as: "categories",
        through: { attributes: [] },
        attributes: ["name"],
        where: { slug }
      }],
      ...this.buildPaginatedQuery(offset, limit)
    };
  }

  static buildCountryQuery(slug, limit, offset) {
    return {
      include: [{
        model: Country,
        as: "countries",
        through: { attributes: [] },
        attributes: ["name"],
        where: { slug }
      }],
      ...this.buildPaginatedQuery(offset, limit)
    };
  }
}

class RelationshipHandler {
  static async handleRelationships(movie, { episodes, categories, countries }) {
    const relationshipPromises = [
      this.handleCategories(categories, movie._id),
      this.handleCountries(countries, movie._id),
      this.handleEpisodes(episodes, movie._id)
    ];
    
    await Promise.all(relationshipPromises.flat());
  }

  static handleCategories(categories, movieId) {
    return categories?.map(category => 
      CategoryService.createCategory(category, movieId)
    ) || [];
  }

  static handleCountries(countries, movieId) {
    return countries?.map(country => 
      CountryService.createCountry(country, movieId)
    ) || [];
  }

  static handleEpisodes(episodes, movieId) {
    return episodes?.map(episode => 
      EpisodeService.createEpisodes(episode, movieId)
    ) || [];
  }
}

class MoviesService {
  static async findMovieById(id) {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      throw new Error(`Movie with id ${id} not found`);
    }
    return movie;
  }

  static async getMovieAll() {
    try {
      const movieAll = await Movie.findAll(MovieQueryBuilder.buildBaseQuery());
      return { data: movieAll, message: "Success" };
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }

  static async getMoviesPages({ page = 1, limit = DEFAULT_PAGE_SIZE, ...queryOptions } = {}) {
    try {
      const query = MovieQueryBuilder.buildPaginatedQuery(page, limit, queryOptions);
      const moviePages = await Movie.findAndCountAll(query);
      const pagination = await PaginationHelper.calculatePagination(
        moviePages.count,
        page,
        limit
      );

      return {
        data: {
          movies: moviePages.rows,
          pagination
        }
      };
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }

  static async getMoviesByCategory({ slug, page = 1, limit = 30 }) {
    try {
      const query = MovieQueryBuilder.buildCategoryQuery(slug, limit, page);
      const movies = await Movie.findAll(query);

      return {
        data: {
          movies,
          offset: PaginationHelper.calculateOffset(page, limit)
        },
        message: "Success"
      };
    } catch (error) {
      throw new Error(`Error fetching movies by category: ${error.message}`);
    }
  }

  static async getMoviesByCountry({ slug, page = 1, limit = 30 }) {
    try {
      const query = MovieQueryBuilder.buildCountryQuery(slug, limit, page);
      const movies = await Movie.findAll(query);

      return {
        data: {
          movies,
          offset: PaginationHelper.calculateOffset(page, limit),
          limit
        },
        message: "Success"
      };
    } catch (error) {
      throw new Error(`Error fetching movies by country: ${error.message}`);
    }
  }

  static async findMovieBySlug({ slug, select = DEFAULT_MOVIE_ATTRIBUTES }) {
    try {
      if (!Array.isArray(select)) {
        throw new Error("Invalid attribute selection");
      }

      return await Movie.findOne({
        where: { slug },
        attributes: select
      });
    } catch (error) {
      throw error;
    }
  }

  static async getMovieBySlug({ slug }) {
    try {
      const movieSlug = await this.findMovieBySlug({ slug });
      if (!movieSlug) {
        return { data: null, message: "Slug not found" };
      }

      const [episodes, categories] = await Promise.all([
        EpisodeService.getEpisodeMovie(movieSlug._id),
        CategoryService.getCategoryMoive(movieSlug._id)
      ]);

      return {
        data: {
          movie: {
            movieSlug,
            category: categories
          },
          episodes
        },
        message: "Success"
      };
    } catch (error) {
      throw new Error(`Error fetching movie by slug: ${error.message}`);
    }
  }

  static async getMovieDetail(movieId) {
    try {
      const movie = await Movie.findByPk(movieId, {
        include: ["episodes", "categories", "countries"]
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
      const existingMovie = await this.findMovieById(data._id).catch(() => null);
      
      if (existingMovie) {
        return await this.updateMovie(data._id, data);
      }

      const newMovie = await Movie.create(data);
      if (!newMovie) {
        throw new Error("Failed to create movie");
      }

      await RelationshipHandler.handleRelationships(newMovie, {
        categories: data.category,
        countries: data.country,
        episodes
      });

      return newMovie;
    } catch (error) {
      throw new Error(`Error creating movie: ${error.message}`);
    }
  }

  static async updateMovie(movieId, data) {
    try {
      await this.findMovieById(movieId);
      
      await Movie.update(data, {
        where: { _id: movieId },
        returning: true
      });

      return this.getMovieDetail(movieId);
    } catch (error) {
      throw new Error(`Error updating movie: ${error.message}`);
    }
  }

  static async deleteMovie(movieId) {
    try {
      const movie = await this.findMovieById(movieId);

      await Promise.all([
        EpisodeService.deleteEpisodesByMovieId(movieId),
        CategoryService.deleteCategoriesByMovieId(movieId),
        CountryService.deleteCountriesByMovieId(movieId)
      ]);

      await movie.destroy();
      return { message: "Movie deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting movie: ${error.message}`);
    }
  }
}

module.exports = MoviesService;