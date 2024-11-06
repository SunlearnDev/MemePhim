const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");
const Movie = require("./movie.model");
const Category = require("./category.model");

const MovieCategory = sequelize.define(
  "MovieCategory",
  {
    movieId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Movie,
        key: "_id",
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "MovieCategory",
  }
);

module.exports = MovieCategory;
