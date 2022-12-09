import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String
            // required: true
        },
        img: {
            type: String,
            default: 'https://0x0.st/o_hD.jpg'
        },
        subscribers: {
            type: Number,
            default: 0,
            min: 0
        },
        subscibedUsers: {
            type: [String]
        },
        fromGoogle: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model('User', UserSchema);
