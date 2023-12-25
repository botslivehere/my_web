const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('My_SQL', 'postgres', '1', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;