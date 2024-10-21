const { DataTypes } = require("sequelize");
const sequelize = require("../configs/configs.mysql");
const  User = require("./user.model");
const  UserDevices  = require("./userDevices.model");

const UserDeviceAssignments = sequelize.define("UserDeviceAssignments", {
  UserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  UserDeviceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UserDevices, 
      key: "id",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = UserDeviceAssignments;
