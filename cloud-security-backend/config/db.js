const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false, // Disable query logging (optional, set to true for debugging)
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connecté à PostgreSQL');
    await sequelize.sync(); // Sync models with database
  } catch (error) {
    console.error('Erreur de connexion PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };