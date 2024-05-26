require('dotenv').config();

const connection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dbLogging: process.env.NODE_ENV === 'development' || process.env.LOG === 'true',
  dialect: process.env.DB_DIALECT, 
};

module.exports = connection;
connection;
