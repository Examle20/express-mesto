const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if(!user) {
        res.status(404).send({message: 'Запрашиваемый пользователь не найден'})
      }else {
        res.send({data: user});
      }
    })
    .catch((err) => {
      if(err.name === 'CastError'){
        res.status(400).send({message: 'Введены некорректные данные для поиска пользователя'})
      }
      else {
        res.send({ message: 'Произошла ошибка' }); }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user){
        res.status(404).send({message: 'Запрашиваемый пользователь не найден'})
      }
      res.send({ data: user })
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
  User.findByIdAndUpdate(req.user._id, { avatar }, {runValidators: true, new: true})
    .then((user) => {
      if(!user){
        res.status(404).send({message: 'Запрашиваемый пользователь не найден'})
      }
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные для обновления аватара пользователя' });
      } else {
        res.status(500).send({ message: err });
      }
    });
};
