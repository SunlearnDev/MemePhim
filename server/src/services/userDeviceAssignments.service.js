"use strict";
const { UserDeviceAssignments } = require("../models/index");

class UserDeviceAssignmentsService {
  static async getUserDeviceAssignments(userId) {
    try {
      const uDa = await UserDeviceAssignments.findAll({
        where: { userId },
        attributes: ["userDeviceId"],
      });
      return uDa;
    } catch (error) {
      throw error;
    }
  }
  static async createUserDeviceAssignments(userId, deviceId) {
    try {
      const userDeviceAssignments = await UserDeviceAssignments.create({
        userId: userId,
        userDeviceId: deviceId,
      });
      return userDeviceAssignments;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUserDeviceAssignments({ userId, deviceId }) {
    try {
      const userDeviceAssignments = await UserDeviceAssignments.destroy({
        where: {
          userId,
          deviceId,
        },
      });
      return userDeviceAssignments;
    } catch (error) {
      throw error;
    }
  }
  static async deleteUserId_DA(userId) {
    try {
      const userDeviceAssignments = await UserDeviceAssignments.destroy({
        where: {
          userId,
        },
      });
      return userDeviceAssignments;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserDeviceAssignmentsService;
