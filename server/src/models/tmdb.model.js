const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");

const Tmdb = sequelize.define(
    "Tmdb",{
    moveId: {
      type: DataTypes.STRING,
      references: {
        model: 'Movie',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false,
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
  }, {
    sequelize,
    modelName: 'Tmdb',
  });


  module.exports = Tmdb;