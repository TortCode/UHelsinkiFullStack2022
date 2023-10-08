const jwt = require('jsonwebtoken');

const tokenExtractor = (request, response, next) => {
  const auth = request.get('Authorization');

  if (auth && auth.startsWith('Bearer ')) {
    request.token = auth.replace('Bearer ', '');
  }
  next();
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
  } else if (error.name === 'CastError') {
    response.status(400).json({ error: 'malformatted id' });
  } else if (error.name === 'JsonWebTokenError') {
    response.status(400).json({ error: error.message });
  }
  next(error);
};

const userExtractor = (request, response, next) => {
  const token = request.token;
  request.user = null;
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken) {
      response.status(401).json({ error: "Token invalid" });
    }
    request.user = decodedToken;
  }
  next()
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
}

module.exports = { tokenExtractor, errorHandler, userExtractor, unknownEndpoint };