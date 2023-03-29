const router = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

router.get('/', async (request, response) => {
  const res = await Blog.find({}).populate('user', { username: 1, name: 1});
  response.json(res);
})

router.post('/', async (request, response, next) => {
  const body = request.body;
  const { title, author, likes } = body;
  const user = await User.findById(body.userId);

  const blog = new Blog({ title, author, likes, user: user.id })

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id)
  await user.save();

  response.status(201).json(result);
})

router.delete('/:id', async (request, response, next) => {
  const id = request.params.id;
  const res = await Blog.findByIdAndDelete(id);
  if (res === null) {
    response.status(404).end();
    return;
  }
  response.status(204).end();
})

router.put('/:id', async (request, response, next) => {
  const id = request.params.id;
  const { body } = request;
  const { title, url, author, likes } = body;

  const blog = { title, url, author, likes, };

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
})


module.exports = router;
