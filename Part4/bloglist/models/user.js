const mongoose = require('mongoose');
const uniqValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3
    },
    name: String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
})

userSchema.plugin(uniqValidator)

userSchema.set('toJSON', {
    'transform': (doc, obj) => {
        obj.id = obj._id;
        delete obj._id;
        delete obj.__v;
        delete obj.passwordHash;
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User