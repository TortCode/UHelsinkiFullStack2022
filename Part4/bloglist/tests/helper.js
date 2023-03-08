const Blog = require('../models/blog');

const getAllBlogs = async () => {
    const blogs = await Blog.find({});
    return blogs.map(b => b.toJSON());
}

const validNonexistentId = async () => {
    const blog = new Blog({
        title: "dummy",
        url: "dummy",
    })

    await blog.save();
    await blog.remove();

    return blog._id.toString();
}

module.exports = { getAllBlogs, validNonexistentId };