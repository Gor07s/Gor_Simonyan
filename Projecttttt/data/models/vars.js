const sequelize = require('./index');
const Sequelize = require('sequelize');
const data = require('./data')

const vars = sequelize.define("vars", {
        tableId : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        varName: {
            type: Sequelize.STRING,
            allowNull: false
        }},
    {
        timestamps: false
    });

vars.belongsTo(data, {foreignKey: "tableId", targetKey: "id"})

module.exports = vars;

// sequelize.sync({ force: true });