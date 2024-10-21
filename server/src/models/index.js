const User = require('./user.model')
const UserDevices = require('./userDevices.model')
const UserDeviceAssignments = require('./userDeviceAssignments.model')

User.belongsToMany(UserDevices, { through: UserDeviceAssignments });
UserDevices.belongsToMany(User, { through: UserDeviceAssignments });

module.exports = {
    User,
    UserDevices,
    UserDeviceAssignments
}