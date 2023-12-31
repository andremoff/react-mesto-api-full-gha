const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthenticatedError = require('../errors/UnauthenticatedError');
const ConflictError = require('../errors/ConflictError');

// Получение всех пользователей
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    if (!users || users.length === 0) {
      throw new NotFoundError('Пользователи не найдены');
    }
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
};

// Получение пользователя по идентификатору
const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('Пользователь с указанным ID не найден');
    }
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

// Получение текущего пользователя
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

// Обновление данных пользователя
const updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true, context: 'query' },
    ).select('-password');
    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.json({ data: updatedUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
    } else {
      next(err);
    }
  }
};

// Обновление аватара пользователя
const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    user.avatar = avatar;
    const updatedUser = await user.save();
    res.json({ data: updatedUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара пользователя'));
    } else {
      next(err);
    }
  }
};

// Создание нового пользователя
const createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  return User.create({
    email,
    password: hashedPassword,
    name,
    about,
    avatar,
  })
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '7d' });

      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        token,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

// Авторизация пользователя
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthenticatedError('Неправильные почта или пароль'));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return next(new UnauthenticatedError('Неправильные почта или пароль'));
    }

    const { NODE_ENV, JWT_SECRET } = process.env;
    const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

    const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '7d' });

    return res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 3600000 * 24 * 7,
      })
      .json({ message: 'Авторизация успешна', token });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
  createUser,
  login,
};
