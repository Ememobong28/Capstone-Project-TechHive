import { User } from './user.js';
import { Internship } from './internships.js'
import { SavedInternship } from './savedInternships.js';
import { UserLikedInternship } from './userLikedInternship.js';

Internship.hasMany(SavedInternship, { foreignKey: 'internshipId' });
SavedInternship.belongsTo(Internship, { foreignKey: 'internshipId' });

User.hasMany(SavedInternship, { foreignKey: 'userId' });
SavedInternship.belongsTo(User, { foreignKey: 'userId' });

Internship.hasMany(UserLikedInternship, { foreignKey: 'internshipId' });
UserLikedInternship.belongsTo(Internship, { foreignKey: 'internshipId' });

User.hasMany(UserLikedInternship, { foreignKey: 'userId' });
UserLikedInternship.belongsTo(User, { foreignKey: 'userId' });

export { User, Internship, SavedInternship, UserLikedInternship };