const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");

const SeoOnPage = sequelize.define(
    "SeoOnPage",
    {
    og_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "website",
    },
    titleHead: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descriptionHead: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    og_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    og_image: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'SeoOnPage',
  });

module.exports = SeoOnPage;
