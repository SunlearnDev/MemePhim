const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        customValidator(value) {
          if (value === null && value.length >= 6) {
            throw new Error("password must be at least 6 characters");
          }
        },
      },
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    status:{
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
    role:{
      type: DataTypes.STRING,
      defaultValue: "user",
      allowNull: true,
    }
  },
  {
    tableName: "Users",
    timestamps: true,
  },
  {
    indexex: [
      {
        type: "FULLTEXT",
        username: "full_text_index",
        unique: false,
        fields: ["username"],
      },
    ],
  }
);

module.exports = User;
