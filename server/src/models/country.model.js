const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");

const Country = sequelize.define(
  "Country",{
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Country',
  });

  module.exports = Country;

