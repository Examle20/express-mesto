const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(16).toString('hex')
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введены некорректные данные для поиска пользователя' });
      } else {
        res.send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!validator.isEmail(email)) {
    res.send({ message: 'Некорректынй email' });
    return;
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      about,
      name,
      avatar,
    }))
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send(err));
  // const { name, about, avatar, email, password } = req.body;
  // User.create({ name, about, avatar, email, password })
  //   .then((user) => res.send({ data: user }))
  //   .catch((err) => {
  //     if (err.name === 'CastError' || err.name === 'ValidationError') {
  //       res.status(400).send({ message: 'Некорректные данные при создании пользователя' });
  //     } else {
  //       res.status(500).send({ message: 'Произошла ошибка' });
  //     }
  //   });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные для обновления пользователя' });
      } else {
        res.status(500).send({ message: err });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные для обновления аватара пользователя' });
      } else {
        res.status(500).send({ message: err });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: '7d' }
      );
      res.send({token: token})
      res.cookie('jwt', token, {
        maxAge: '7d',
        httpOnly: true
      })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
