const sequelize = require('../configs/configs.mysql');

const checkConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
checkConnection();
module.exports = checkConnection;
