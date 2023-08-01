import {DataTypes} from 'sequelize';
import {sequelize} from '../database.js'

export const UserLikedInternship = sequelize.define('UserLikedInternship', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    internshipId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});