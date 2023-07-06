import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('capstone', 'emem', 'ememobong', {
  host: 'localhost',
  dialect: 'postgres'
});