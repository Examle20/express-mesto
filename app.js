const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  login, createUser
} = require('./controllers/users');

const { PORT = 3001 } = process.env;
const app = express();
// 6079e0735a992a5abae2465a
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6079db58ee13d454da586228',
  };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send('Not Found', 404);
});

app.listen(PORT);
