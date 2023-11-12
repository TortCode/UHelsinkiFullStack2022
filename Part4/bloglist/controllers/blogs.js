const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

router.get("/", async (request, response) => {
  const res = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(res);
});

router.post("/", async (request, response) => {
  const body = request.body;
  if (!request.user || !request.user.id) {
    response.status(401).json({ error: "Token invalid" });
    return;
  }

  const { title, author, likes, url } = body;
  const user = await User.findById(request.user.id);
  if (!user) {
    response.status(400).json({ error: "User invalid" });
    return;
  }

  const blog = new Blog({ title, author, likes, url, user: user._id });

  const result = await (
    await blog.save()
  ).populate("user", { username: 1, name: 1 });
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

router.delete("/:id", async (request, response) => {
  if (!request.user.id) {
    response.status(401).json({ error: "Token invalid" });
    return;
  }

  const id = request.params.id;
  const res = await Blog.findOneAndDelete({ _id: id, user: request.user.id });
  if (res === null) {
    response.status(404).end();
    return;
  }
  response.status(204).end();
});

router.put("/:id", async (request, response) => {
  if (!request.user.id) {
    response.status(401).json({ error: "Token invalid" });
    return;
  }

  const id = request.params.id;
  const { body } = request;
  const { title, url, author, likes } = body;

  const blog = { title, url, author, likes };

  const opts = {
    runValidators: true,
    new: true,
  };

  const newBlog = await Blog.findByIdAndUpdate(id, blog, opts).populate(
    "user",
    { username: 1, name: 1 }
  );

  if (newBlog === null) {
    response.status(404).end();
    return;
  }
  response.json(newBlog);
});

router.post("/:id/comments", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (blog === null) {
    response.status(404).end();
    return;
  }
  if (!blog.comments) {
    blog.comments = [];
  }
  blog.comments.push(request.body.comment);
  const newBlog = await blog.save();
  response.status(200).json(newBlog);
});

module.exports = router;
