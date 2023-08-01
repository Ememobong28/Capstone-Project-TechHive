import express from 'express'
import { SavedInternship, Internship, User, UserLikedInternship } from '../models/index.js'

const router = express.Router();

router.get('/recommendations/:userId', async (req, res) => {
    const userId = req.params.userId;

    try{
        //fetch the user's saved  internships
        const savedInternships = await SavedInternship.findAll({
            where: {userId},
            include: Internship,
        });

       // Fetch the user's liked internships
    const likedInternships = await UserLikedInternship.findAll({
        where: { userId },
      });
  
      // Extract categories of saved and liked internships
      const userCategories = savedInternships.map(si => si.Internship.category).flat();
  
      // Find internships with matching categories but not in the saved/liked list
      const recommendedInternshipsByContent = await Internship.findAll({
        where: {
          category: { $overlap: userCategories },
          id: { $notIn: savedInternships.map(si => si.Internship.id) },
        },
      });
  
      // Collaborative filtering: Fetch similar users based on liked internships
      const similarUsers = await UserLikedInternship.findAll({
        where: { internshipId: likedInternships.map(like => like.internshipId) },
        attributes: ['userId'],
        group: ['userId'],
        having: sequelize.where(sequelize.fn('COUNT', 'userId'), '>=', 2), // Consider users with at least 2 liked internships in common
      });
  
      const similarUserIds = similarUsers.map(user => user.userId);
  
      // Find internships liked by similar users that the current user has not saved or liked
      const recommendedInternshipsByCollaborativeFiltering = await UserLikedInternship.findAll({
        where: {
          userId: { $in: similarUserIds },
          internshipId: { $notIn: [...savedInternships.map(si => si.internshipId), ...likedInternships.map(like => like.internshipId)] },
        },
        include: Internship,
      });
  
      const recommendedInternships = [
        ...recommendedInternshipsByContent,
        ...recommendedInternshipsByCollaborativeFiltering.map(item => item.Internship),
      ];
  
      res.json(recommendedInternships);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  export default router;