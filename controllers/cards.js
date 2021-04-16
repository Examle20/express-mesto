const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(()=> res.send({ message: 'Успешно'}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
