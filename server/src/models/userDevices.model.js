const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../configs/configs.mysql");

const UserDevices = sequelize.define('UserDevices', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  });

module.exports = UserDevices;