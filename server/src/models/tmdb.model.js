const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");
const Movie = require("./movie.model");

const Tmdb = sequelize.define(
  "Tmdb",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    moveId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Movie,
        key: "_id",
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    season: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vote_average: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    vote_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Tmdb",
  }
);

module.exports = Tmdb;
