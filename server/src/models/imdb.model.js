const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");

const Imdb = sequelize.define(
  "Imdb",{
    movieId: {
      type: DataTypes.STRING,
      references: {
        model: 'movie',
        key: 'id',
      },
    },
    id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Imdb',
  });

module.exports = Imdb;
