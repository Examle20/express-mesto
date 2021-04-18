const Card = require('../models/card');

module.exports.doesCardExist = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then(card => {
      if(!card) {
        res.status(404).send({message: 'Карточка с указанным _id не найдена.'})
        return
      }
    })
    .catch(() => {res.status(500).send({ message: 'Произошла ошибка' })});
  next();
};

module.exports.getCards = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  Card.find({})
    .populate(['owner', 'likes'])
    .then(cards => res.send({data: cards}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch((err) =>{
      if(err.name === 'ValidationError'){
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки'});
      }else {
        res.status(500).send({ message: err});
      }
    })
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(()=> res.send({ message: 'Успешно'}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .populate('likes')
  .then((card)=> res.send({likes: card.likes}))
  .catch((err) =>{
    if(err.name === 'TypeError' || err.name ==='CastError'){
      res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка'});
    }else {
      res.status(500).send({ message: err});
    }
  })

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then(()=> res.send({ message: 'Успешно'}))
  .catch((err) =>{
    if(err.name === 'TypeError' || err.name ==='CastError'){
      res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка'});
    }else {
      res.status(500).send({ message: err});
    }
  })