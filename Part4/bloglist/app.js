const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')


app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === 'ValidationError') {
    response.status(400).json({error:error.message});
  }
  next(error);
}

app.use(errorHandler);

module.exports = app
