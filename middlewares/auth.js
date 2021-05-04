const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '4515bce25ce4463c3baa7be420b0ac62c8fb33d19bd1cb15056364a284ff9a2b');
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next();
};
