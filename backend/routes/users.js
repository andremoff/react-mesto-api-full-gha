const express = require('express');
const { celebrate } = require('celebrate');

const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  updateAvatar,
  login,
} = require('../controllers/users');

const {
  userIdSchema,
  updateUserSchema,
  updateAvatarSchema,
  loginSchema,
} = require('../middlewares/validationSchemas');

const usersRouter = express.Router();

usersRouter.get('/', getUsers);
usersRouter.post('/signin', celebrate({ body: loginSchema }), login);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', celebrate({ params: userIdSchema }), getUserById);
usersRouter.patch('/me', celebrate({ body: updateUserSchema }), updateUser);
usersRouter.patch('/me/avatar', celebrate({ body: updateAvatarSchema }), updateAvatar);

module.exports = usersRouter;
