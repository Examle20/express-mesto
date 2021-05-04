module.exports = class WrongEmail extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
