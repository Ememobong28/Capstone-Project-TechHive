import { User } from './user.js';
import { Post } from './post.js';
import { Internship } from './internships.js'

User.hasMany(Post, { as: 'Posts', foreignKey: 'userId' });
Post.belongsTo(User, { as: 'User', foreignKey: 'userId' });

export { User, Post, Internship };