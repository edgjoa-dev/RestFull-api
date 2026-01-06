import { Schema, model} from 'mongoose'


const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
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

//Quitar password de objeto en el retorno de creación de usuario.
UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();

    //Cambio de _id a uid.
    user.uid = _id;

    return user;
}

export const User = model('User', UserSchema);