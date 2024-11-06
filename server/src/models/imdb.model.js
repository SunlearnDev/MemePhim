const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");
const Movie = require("./movie.model");

const Imdb = sequelize.define(
  "Imdb",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    movieId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Movie,
        key: "_id",
      },
    },
  },
  {
    sequelize,
    modelName: "Imdb",
  }
);

module.exports = Imdb;
