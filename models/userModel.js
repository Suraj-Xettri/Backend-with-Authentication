import mongoose from 'mongoose';

mongoose.connect(`mongodb://localhost:27017/authentation`)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    image:{
        type: String,
        default: "unknown.jpg"
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

const User = mongoose.model('User', userSchema);

export default User;
