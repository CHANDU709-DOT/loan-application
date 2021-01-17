//Postgres SQL connection
const { Client } = require("pg");

const client = new Client({
    database: 'Application',
    user: 'postgres',
    password: 'chandu',
    dialect: 'postgres',
    port: '5433',
    host: 'localhost',
    //ssl:true
});


module.exports = client;
  
