import { Schema, model} from 'mongoose'


const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['USER_ROLE', 'ADMIN_ROLE'] 
    },
    google: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
})


module.exports = model('User', UserSchema)