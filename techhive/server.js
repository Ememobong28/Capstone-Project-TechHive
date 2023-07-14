import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {sequelize} from './database.js';
import {Internship} from './models/index.js';
import { User} from './models/index.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors())
app.use(express.json()); //Middleware for parsing JSON bodies from HTTP requests
app.use(morgan('combined'))

// Route for user authentication and account creation
app.use('/auth', authRoutes);

app.use('/images', express.static('images'));



//Route to get all internships
app.get('/', (req, res) => {
  res.send('Welcome to the TechHive API!');
});

app.get('/internships', async (req,res) => {
  try{
    const internships = await Internship.findAll();
    res.json(internships);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

//Route to get internships by id
app.get('/internships/:id', async (req, res) => {
  try {
    const internships = await Internship.findByPk(req.params.id);
    if (internships) {
      res.json(internships);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a user by id
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


sequelize.sync({alter: true})
.then(() => {
  const port = 3000;
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
});