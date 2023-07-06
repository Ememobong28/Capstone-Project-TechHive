import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});