const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");

const Movie = sequelize.databaseVersion(
  "Movie",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    origin_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "hoathinh",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    poster_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumb_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_copyright: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sub_docquyen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    chieurap: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    trailer_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    episode_current: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    episode_total: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lang: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notify: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    showtimes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    view: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Film',
  });

module.exports = Movie;
