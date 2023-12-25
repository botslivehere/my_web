const { DataTypes } = require('sequelize');

const sequelize = require("../database/MySQL");

const Authories = sequelize.define('Authories', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        schema: 'My_Schema'
    }
);

module.exports = Authories;
