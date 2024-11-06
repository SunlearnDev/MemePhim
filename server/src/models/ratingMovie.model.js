const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");
const Movie = require("./movie.model");
const User = require("./user.model");

const Ratingmovie = sequelize.define(
  "Ratingmovie",
  {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    movieId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Movie,
        key: "_id",
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ratedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Ratingmovie",
  }
);

module.exports = Ratingmovie;
