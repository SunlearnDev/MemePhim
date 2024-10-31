'use strict';
const { UserDevices,  } =  require ('../models/index');

class UserDevicesService {
    static async getUserDevices( userId ) {
        try {
            const userDevices = await UserDevices.findAll({
                where: { userId },
                attributes: ['id', 'deviceId', 'token']
            });
            return userDevices;
        } catch (error) {
            throw error;
        }
    }

    static async createUserDevices({ deviceId, token }) {
        try {
            const userDevices = await UserDevices.create({
                deviceId,
                token
            });
            return userDevices;
        } catch (error) {
            throw error;
        }
    }

    static async updateUserDevices({ userId, deviceId, token }) {
        try {
            const userDevices = await UserDevices.update({
                token
            }, {
                where: {
                    userId,
                    deviceId
                }
            });
            return userDevices;
        } catch (error) {
            throw error;
        }
    }

    static async deleteUserDevices({ userId, deviceId }) {
        try {
            const userDevices = await UserDevices.destroy({
                where: {
                    userId,
                    deviceId
                }
            });
            return userDevices;
        } catch (error) {
            throw error;
        }
    }
    static async deleteUserIdDevices( deviceId ) {
        try {
            const userDevices = await UserDevices.destroy({
                where: {
                    id : deviceId
                }
            });
            return userDevices;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserDevicesService;