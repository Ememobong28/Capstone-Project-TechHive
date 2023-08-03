import express from 'express';
import { SavedInternship, Internship, User, UserLikedInternship } from '../models/index.js';
import {sequelize} from '../database.js'
import sgMail from '@sendgrid/mail';
import { Op } from 'sequelize';

const router = express.Router();

sgMail.setApiKey('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');

router.get('/recommendations/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch the user's saved internships
    const savedInternships = await SavedInternship.findAll({
      where: { userId },
      include: Internship,
    });

    const savedInternshipsData = savedInternships.map(si => si.get());

    // Fetch the user's liked internships
    const likedInternships = await UserLikedInternship.findAll({
      where: { userId },
      include: Internship,
    });

    const likedInternshipsData = likedInternships.map(like => like.get());


    // Extract companies of saved and liked internships
    const userCompanies = [
      ...new Set([...savedInternshipsData.map(si => si.Internship.company), ...likedInternshipsData.map(like => like.Internship.company)]),
    ];


    // Check if the savedInternshipsData, likedInternshipsData, and userCompanies arrays are defined and have elements
    if (Array.isArray(savedInternshipsData) && savedInternshipsData.length > 0) {
      // Use the map function on savedInternshipsData
    }

    if (Array.isArray(likedInternshipsData) && likedInternshipsData.length > 0) {
      // Use the map function on likedInternshipsData
    }

    if (Array.isArray(userCompanies) && userCompanies.length > 0) {
      // Use the map function on userCompanies
    }

    // Find internships with matching companies but not in the saved/liked list
    const recommendedInternshipsByContent = await Internship.findAll({
      where: {
        company: { [Op.in]: userCompanies },
        id: { [Op.notIn]: savedInternshipsData.map(si => si.Internship.id) },
      },
    });

    if (recommendedInternshipsByContent.length === 0) {
      const randomInternships = await Internship.findAll({
        where: {
          id: { [Op.notIn]: [...savedInternshipsData.map(si => si.Internship.id), ...likedInternshipsData.map(like => like.Internship.id)] },
        },
        limit: 2,
      });

      // Combine the recommended internships from different sources into a single array
      const recommendedInternships = [...randomInternships];


      // Send the recommendation emails to the user
      const user = await User.findByPk(userId);
      const msg = {
        to: user.email,
        from: 'techhivewebsite@gmail.com',
        subject: 'New Internship Recommendations',
        text: `Dear ${user.username}, here are some recommended internships for you: \n\n${recommendedInternships
          .map((internship) => `${internship.title} - ${internship.link}`)
          .join('\n')}`,
        html: `<p>Dear ${user.username},</p><p>Here are some recommended internships for you:</p><ul>${recommendedInternships
          .map((internship) => `<li><a href="${internship.link}">${internship.title}</a></li>`)
          .join('')}</ul>`,
      };

      await sgMail.send(msg);
      console.log(`Recommendation email sent to ${user.email}`);

      res.json(recommendedInternships);
    } else {
      // Combine the recommended internships from content-based filtering
      const recommendedInternships = [...recommendedInternshipsByContent];


      // Send the recommendation emails to the user
      const user = await User.findByPk(userId);
      const msg = {
        to: user.email,
        from: 'techhivewebsite@gmail.com',
        subject: 'New Internship Recommendations',
        text: `Dear ${user.username}, here are some recommended internships for you: \n\n${recommendedInternships
          .map((internship) => `${internship.title} - ${internship.link}`)
          .join('\n')}`,
        html: `<p>Dear ${user.username},</p><p>Here are some recommended internships for you:</p><ul>${recommendedInternships
          .map((internship) => `<li><a href="${internship.link}">${internship.title}</a></li>`)
          .join('')}</ul>`,
      };

      await sgMail.send(msg);
      console.log(`Recommendation email sent to ${user.email}`);

      res.json(recommendedInternships);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;