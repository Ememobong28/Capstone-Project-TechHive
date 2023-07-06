// internship.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js'; 

export const Internship = sequelize.define('Internship', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: false
  },
});

