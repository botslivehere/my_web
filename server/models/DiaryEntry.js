const { DataTypes } = require('sequelize');
const sequelize = require('../database/MySQL');

const DiaryEntry = sequelize.define('DiaryEntry', {
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    dates: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    completed:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    schema: 'My_Schema',
});

module.exports = DiaryEntry;
