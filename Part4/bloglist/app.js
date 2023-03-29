const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('express-async-errors');
const logger = require('./utils/logger');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB"); 
  })
  .catch((err) => {
    logger.error("Error occurred: ", err.message);
  });

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === 'ValidationError') {
    response.status(400).json({error:error.message});
  } else if (error.name === 'CastError'){
    response.status(400).json({error: 'malformatted id'});
  }
  next(error);
};

app.use(errorHandler);

module.exports = app;
