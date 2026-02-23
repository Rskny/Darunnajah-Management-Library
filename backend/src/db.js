const knex = require('knex');
const knexfile = require('../knexfile');

const environment = process.env.NODE_ENV || 'development';
const configOptions = knexfile[environment];

const db = knex(configOptions);

module.exports = db;
