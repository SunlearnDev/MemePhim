const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");

const Category = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
  }
);

module.exports = Category;
