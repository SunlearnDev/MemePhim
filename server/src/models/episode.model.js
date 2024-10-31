const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");

const Episode = sequelize.define(
  "Episode",
  {
    movie: {
      type: DataTypes.STRING,
      references: {
        model: "Movie",
        key: "id",
      },
    },
    server_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link_embed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link_m3u8: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Episode",
  }
);

module.exports = Episode;
