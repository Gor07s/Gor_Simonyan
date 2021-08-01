const sequelize = require('./index');
const Sequelize = require('sequelize');
const data = require('./data')

const recipients = sequelize.define("recipients", {
        tableId : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        }},
    {
        timestamps: false
    });

recipients.belongsTo(data, {foreignKey: "tableId", targetKey: "id", onDelete: "CASCADE"})

module.exports = recipients;