const Blog = require('../models/blog');
const User = require('../models/user');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./helper');

const bcrypt = require('bcrypt');

const initialBlogs = [
    {
        title: "How to write Rust",
        author: "Linus",
        url: "htasd.fdsaf.com",
        likes: 4
    },
    {
        title: "How to write Go",
        author: "Bill Joy",
        url: "fsbghtsdf.ndgns.edu",
        likes: 101
    },
    {
        title: "How to write TypeScript",
        author: "Bill Gates",
        url: "fasbdf.bxbgdsz.org",
        likes: 54
    }
]

let auth = "";

beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = await (new User({ username: 'root2', passwordHash })).save();
    const userid = user._id;

    initialBlogs.forEach(blog => blog.user = userid);

    const resp = await api
        .post("/api/login")
        .send({ username: 'root2', password: 'sekret' });
    auth = "Bearer " + resp.body.token;
    await Blog.deleteMany({});
    await Promise.all(initialBlogs.map(blog => (new Blog(blog)).save()));
})

afterAll(() => {
    const mongoose = require('mongoose');
    mongoose.connection.close();
})

describe('HTTP GET', () => {
    // step one
    test('returns correct amount of blog posts in json format', async () => {
        const blog_results =
            await api
                .get("/api/blogs")
                .expect(200)
                .expect('Content-Type', /application\/json/);

        expect(blog_results.body).toHaveLength(initialBlogs.length);
    })

    // step two
    test('returns identifier under property name id and eliminates underscore props', async () => {
        const blog_results = await api.get("/api/blogs");
        blog_results.body.forEach(blog => {
            expect(blog.id).toBeDefined();
            expect(blog._id).toBeUndefined();
            expect(blog.__v).toBeUndefined();
        })
    })
})


describe('HTTP POST', () => {
    // step three
    test('increases the number of blogs by one', async () => {
        const blog = {
            title: "How to write Clojure",
            author: "Bill Nye",
            url: "afds.fsdc.com",
            likes: 50
        };

        await api
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', auth)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const blog_results = await api.get('/api/blogs');
        expect(blog_results.body.map(b => b.title)).toContain(blog.title);
    })

    // step three
    test('without likes value defaults to 0', async () => {
        const blog = {
            title: "How to write Elixir",
            author: "Kernighan",
            url: "fbdsg.werdd.edu",
        };

        const response =
            await api
                .post('/api/blogs')
                .set('Authorization', auth)
                .send(blog)
                .expect('Content-Type', /application\/json/);

        expect(response.body.likes).toBe(0);
    })

    // step four
    test('with url or title missing results in code 400', async () => {
        const blog1 = {
            url: "fadsfad.gsdb.as.org",
            author: "George Washington",
            likes: 41,
        };

        const blog2 = {
            title: "How to write Dart",
            author: "Richard Nixon",
            likes: 69,
        };

        await api.post('/api/blogs').set('Authorization', auth).send(blog1).expect(400);
        await api.post('/api/blogs').set('Authorization', auth).send(blog2).expect(400);
    });

    test('fails with code 401 if token is not provided', async () => {
        const blog = {
            title: "How to write Go",
            author: "Bill Joy",
            url: "fsbghtsdf.ndgns.edu",
        }

        await api.post('/api/blogs').send(blog).expect(401);
    })
})

describe('HTTP DELETE', () => {
    // step 1 of expansions
    test('succeeds with code 204 for a valid id', async () => {
        const startBlogs = await helper.getAllBlogs();
        await api
            .delete(`/api/blogs/${startBlogs[0].id}`)
            .set('Authorization', auth)
            .expect(204);

        const afterBlogs = await helper.getAllBlogs();

        expect(afterBlogs).toHaveLength(startBlogs.length - 1);

        expect(afterBlogs.map(b => b.title)).not.toContain(startBlogs[0].title);
    })

    test('fails and returns 404 for nonexistent id', async () => {
        const id = await helper.validNonexistentId();
        await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization', auth)
            .expect(404);
    })
})

describe('HTTP PUT', () => {
    test('succeeds with code 200 for valid id and data', async () => {
        const startBlogs = await helper.getAllBlogs();
        const newFirstBlog = { ...startBlogs[0], likes: 1729 };
        await api
            .put(`/api/blogs/${startBlogs[0].id}`)
            .set('Authorization', auth)
            .send(newFirstBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const endBlogs = await helper.getAllBlogs();
        expect(endBlogs).toHaveLength(startBlogs.length);
        expect(endBlogs[0].likes).toBe(1729);
    })

    test('fails with code 404 for nonexistent valid id', async () => {
        const id = await helper.validNonexistentId();
        const startBlogs = await helper.getAllBlogs();
        const blog = startBlogs[0];

        await api
            .put(`/api/blogs/${id}`)
            .set('Authorization', auth)
            .send(blog)
            .expect(404);

        const endBlogs = await helper.getAllBlogs();
        expect(startBlogs).toEqual(endBlogs);
    })
})