// savedInternship.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js'; 
import { User } from './user.js';
import { Internship } from './internships.js';

export const SavedInternship = sequelize.define('SavedInternship', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, 
      key: 'id', 
    }
  },
  internshipId: {
    type: DataTypes.INTEGER,
    references: {
      model: Internship, 
      key: 'id', 
    }
  },
}, {
  tableName: 'savedinternships' 
});
