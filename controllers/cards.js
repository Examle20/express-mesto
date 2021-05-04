const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const InvalidRequestError = require('../errors/invalidRequestError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InvalidRequestError('Введены некорректные данные для создания карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена');
      }
      if (card.owner._id.toString() === req.user._id) {
        Card.findByIdAndRemove(card._id)
          .then(() => res.send({ message: 'Успешно' }))
          .catch(next);
      } else {
        throw new ForbiddenError('Удалять можно только свои карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InvalidRequestError('Введены некорректные данные для удаления карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .populate('likes')
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с таким id не найдена');
    }
    res.status(200).send({ likes: card.likes });
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new InvalidRequestError('Переданы некорректные данные для постановки лайка'));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .populate('likes')
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с таким id не найдена');
    }
    res.status(200).send({ likes: card.likes });
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new InvalidRequestError('Переданы некорректные данные для снятия лайка'));
    } else {
      next(err);
    }
  });
