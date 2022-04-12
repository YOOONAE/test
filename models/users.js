const mongoose = require('mongoose');
const paassportLocalMongoose = require('passport-local-mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'what the.. plz input email'],
        unique: [true, 'email duplication']
    }
});
userSchema.plugin(paassportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = User;



