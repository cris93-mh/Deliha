const Sequelize = require('sequelize');
const sequelize = new Sequelize('delilahdatabase', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

mysql: module.exports = {sequelize};