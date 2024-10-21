'use strict';
const { UserDeviceAssignments } = require('../models/index');   

class UserDeviceAssignmentsService {
    static async createUserDeviceAssignments({ userId, deviceId }) {
        try {
            const userDeviceAssignments = await UserDeviceAssignments.create({
                userId,
                deviceId
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
                    deviceId
                }
            });
            return userDeviceAssignments;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserDeviceAssignmentsService;