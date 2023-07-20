import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User, Internship, SavedInternship } from './models/index.js';
import { sequelize } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './seeders/users.json'), 'utf8'));
const internshipData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './seeders/internships.json'), 'utf8'));
const savedInternshipData = JSON.parse(fs.readFileSync(path.resolve(__dirname, './seeders/savedInternships.json'), 'utf8'));

const seedDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });

    const createdUsers = await User.bulkCreate(userData);
    console.log('User data has been seeded!');

    const createdInternships = await Internship.bulkCreate(internshipData.internships);
    console.log('Internship data has been seeded!');

    const savedInternshipDataWithIds = savedInternshipData.map((item, index) => {
      return {
        ...item,
        userId: createdUsers[index].id,
        internshipId: createdInternships[index].id
      };
    });

    await SavedInternship.bulkCreate(savedInternshipDataWithIds);
    console.log('Saved Internship data has been seeded!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close();
  }
};


seedDatabase();