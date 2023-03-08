require('dotenv').config();

const passwd = process.env.PASSWD

const db_name = (process.env.NODE_ENV === 'test') ? 'testBloglist' : 'bloglist'

const MONGODB_URI = `mongodb+srv://fullstack:${encodeURIComponent(passwd)}@cluster0.z34ylzi.mongodb.net/${db_name}?retryWrites=true&w=majority`;

const PORT = 3003;

module.exports = {
    MONGODB_URI,
    PORT,
};


