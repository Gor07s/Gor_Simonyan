const sequelize = require('./index');
const Sequelize = require('sequelize');

const data = sequelize.define("data", {
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    templateName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    templateText: {
        type: Sequelize.STRING,
        allowNull: false
    },
    templateTitle:{
        type: Sequelize.STRING,
        allowNull: false
    },
    templateFrom:{
        type: Sequelize.STRING,
        allowNull: false
    }},
{
    timestamps: false
});

module.exports = data;

// sequelize.sync({ force: true });