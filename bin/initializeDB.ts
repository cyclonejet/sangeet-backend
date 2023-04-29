import { Sequelize } from 'sequelize';

const {
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;

if (
  !POSTGRES_DB ||
  !POSTGRES_HOST ||
  !POSTGRES_PASSWORD ||
  !POSTGRES_PORT ||
  !POSTGRES_USER
) {
  throw new Error('Not enough environment variables');
}

export const sequelize = new Sequelize(
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  {
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT),
    dialect: 'postgres',
  }
);

export const initializeDb = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `Successfully connected to ${POSTGRES_DB} database at ${POSTGRES_PORT}`
    );
  } catch (error) {
    console.log('Unable to connect to the database.', error);
  }
};
