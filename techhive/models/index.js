import { User } from './user.js';
import { Internship } from './internships.js'
import { SavedInternship } from './savedInternships.js';

Internship.hasMany(SavedInternship, { foreignKey: 'internshipId' });
SavedInternship.belongsTo(Internship, { foreignKey: 'internshipId' });

User.hasMany(SavedInternship, { foreignKey: 'userId' });
SavedInternship.belongsTo(User, { foreignKey: 'userId' });

export { User, Internship, SavedInternship };