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
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken) {
      response.status(401).json({ error: "Token invalid" });
    }
    request.user = decodedToken;
  }
  next()
};

module.exports = { tokenExtractor, errorHandler, userExtractor };