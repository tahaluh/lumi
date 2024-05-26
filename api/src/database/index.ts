import { Dialect, Sequelize } from 'sequelize';
import connection from './config';

const { database, username, password, host, dbLogging, dialect } = connection;

const sequelizeConnection = new Sequelize(database, username, password, {
	host,
	logging: dbLogging,
	dialect: dialect as Dialect,
});

export default sequelizeConnection;
