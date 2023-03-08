const router = require('express').Router();
const Blog = require('../models/blog');

router.get('/', async (request, response) => {
  const res = await Blog.find({});
  response.json(res);
})

router.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    const result = await blog.save();
    response.status(201).json(result);
  } catch (err) {
    next(err);
  }
})

router.delete('/:id', async (request, response, next) => {
  const id = request.params.id;
  try {
    const res = await Blog.findByIdAndDelete(id);
    if (res === null) {
      response.status(404).end();
      return;
    }
    response.status(204).end();
  } catch (err) {
    next(err);
  }
})

router.put('/:id', async (request, response, next) => {
  const id = request.params.id;
  const { body } = request;
  const { title, url, author, likes } = body;

  const blog = { title, url, author, likes, };

  try {
    const opts = {
      runValidators: true,
      new: true,
    };
    const newBlog = await Blog.findByIdAndUpdate(id, blog, opts);
    if (newBlog === null) {
      response.status(404).end();
      return;
    }
    response.json(newBlog);
  } catch (err) {
    next(err);
  }
})


module.exports = router;
