const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");

const BreadCrumb = sequelize.define(
  "BreadCrumb",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BreadCrumb",
  }
);

module.exports = BreadCrumb;
