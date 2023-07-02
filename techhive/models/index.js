import { User } from './user';
import { Post } from './post';

User.hasMany(Post, { as: 'Posts', foreignKey: 'userId' });
Post.belongsTo(User, { as: 'User', foreignKey: 'userId' });

export { User, Post };