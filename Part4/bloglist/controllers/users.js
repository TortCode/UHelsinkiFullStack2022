const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../models/user');

router.post('/', async (request, response) => {
    const { username, name, password } = request.body;
    console.log(request.body);

    if (!password || password.length < 3) {
        response.status(400).json({ error: "Password of at least 3 characters must be given" })
        return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save();

    response.status(201).json(savedUser);
})

router.get('/', async (request, response) => {
    const users = User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
    response.json(users);
})

module.exports = router