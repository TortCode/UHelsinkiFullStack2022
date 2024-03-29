const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();

const User = require('../models/user');

router.post('/', async (request, response) => {
    const { username, password } = request.body;

    const user = await User.findOne({ username });
    const passwordCorrect =
        user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        response.status(401).json({ error: "invalid username or password" });
        return;
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response.json({ token, ...userForToken });
})

module.exports = router;