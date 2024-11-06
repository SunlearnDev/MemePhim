const { Tmdb } = require('../models/index');

class TmdbService{
    static async findMoviesByQuery(query) {
        try {
            return await Tmdb.find({ query });
        } catch (error) {
            throw new Error(`Error finding movies: ${error.message}`);
        }
    }
    static async findMovieById(movieId) {
        try {
            return await Tmdb.findByPk(movieId);
        } catch (error) {
            throw new Error(`Error finding movie: ${error.message}`);
        }
    }
    static async createTmdb(data, movieId) {
        try {
        
            const newTmdb = await Tmdb.create(
                {
                    id: data.id,
                    movieId: movieId,
                    season: data.season,
                    vote_average:data.vote_average,
                    vote_count:data.vote_count,
                }
            );
            return newTmdb;
        } catch (error) {
            throw error;
        }
    }
    static async updateTmdb(movieId, data) {
        try {
            const movie = await Tmdb.findByPk(movieId);
            if (movie) {
                await Tmdb.update(data, {
                    where: { movieId: movieId },
                });
                return data;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = TmdbService;