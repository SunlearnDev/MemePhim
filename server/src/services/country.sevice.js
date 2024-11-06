const { Country, MovieCountry } = require("../models/index");

class CountryService {
    static getCountry() {
        try {
            const countries = Country.findAll();
            return countries;
        } catch (error) {
            throw error;
        }
    }        
    static getCountryById(id) {
        try {
            const country = Country.findByPk(id);
            return country;
        } catch (error) {
            throw error;
        }
    }
    static async createCountry(data, movieId) {
        try {
            const checkid = await this.getCountryById(data.id);
            if (checkid) {
                 await MovieCountry.create({
                    movieId: movieId,
                    countryId: checkid.id,
                });
            }
            const newCountry = await Country.create(data);
            if (!newCountry) throw new Error("Cannot create country");
            const newMovieCountry = await MovieCountry.create({
                movieId: movieId,
                countryId: newCountry.id,
            });
            return newMovieCountry;
        } catch (error) {
            throw error;
        }
    
    }
    static async updateCountry(id, data) {
        try {
            const country = await Country.findByPk(id);
            if (country) {
                await Country.update(data, {
                    where: { id: id },
                });
                return data;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = CountryService;
