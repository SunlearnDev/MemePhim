const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
    process.env.MYSQL_NAME || 'memefilm',
    process.env.MYSQL_USER || 'root',
    process.env.MYSQL_PASSWORD || '', {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false
});

module.exports = sequelize;