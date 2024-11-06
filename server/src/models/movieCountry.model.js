const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");
const Movie = require("./movie.model");
const Country = require("./country.model");

const MovieCountry = sequelize.define(
  "MovieCountry",
  {
    movieId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Movie,
        key: "_id",
      },
    },
    countryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Country,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "movieCountry",
  }
);

module.exports = MovieCountry;
