const bcrypt = require('bcrypt');
const User = require('../models/user');
const app = require('../app');
const supertest = require('supertest')
const api = supertest(app);

describe('when there is one user in db initially', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'root', passwordHash}); 

        await user.save();
    })

    test('creation succeeds with fresh username', async () => {
        const usersAtStart = await User.find({});

        const newUser = {
            username: "hefadsf",
            name: "george clooney",
            password: "fawdjvn"
        };

        await api.post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await User.find({});
        expect(usersAtEnd).toHaveLength(usersAtStart.length+1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    })

    test('creation fails with proper statuscode and error message if username already taken', async () => {
        const usersAtStart = await User.find({});

        const newUser = {
            username: 'root',
            name: "george bush the elder",
            password: "asfdgs"
        }

        const result = await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('expected `username` to be unique');

        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toEqual(usersAtStart);
    })

    test('creation fails if username has length less than 3', async () => {
        const newUser = {
            username: "bn",
            name: "obama the younger",
            password: "bbadffas"
        }

        const result = 
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        
        expect(result.body.error).toMatch(/`username`.*shorter than the minimum allowed length/)
    })

    test('creation fails if password has length less than 3', async () => {
        const newUser = {
            username: "bnf",
            name: "obama the younger",
            password: "bb"
        }

        const result = 
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        
        expect(result.body.error).toContain('Password of at least 3 characters must be given');
    })
})