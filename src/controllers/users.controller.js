import { request, response } from "express";
import { User } from "../models/index.js";
import bcrypt from 'bcrypt'




export const usersGet = async(req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;

    const users = await User.find({ status: true })
        .skip(Number(from))
        .limit(Number(limit))

    const total = await User.countDocuments({ status: true });

    res.status(200).json(
        {
            total,
            limit,
            from,
            users,
        }
    )
};

export const userGet = (req = request, res = response) => {
    res.status(200).json(
        {
            msg: 'API GET - ID',
        }
    )
};

export const createUser = async (req = request, res = response) => {

    const { name, lastname, email, password, role } = req.body;
    const user = new User({ name, lastname, email, password, role });

    //Hashear contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);


    //guardar en db
    await user.save();

    res.status(201).json(
        {
            msg: 'Usuario creado',
            user,
        }
    )
};


export const updateUser = async (req = request, res = response) => {

    const id = req.params.id
    const { _id, email, password, google, ...rest } = req.body

    //TODO - validar contra DB
    if (password) {
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest)

    res.status(201).json(
        {
            msg: 'User updated',
            user
        }
    )
};

export const deleteUser = (req = request, res = response) => {
    res.status(200).json(
        {
            msg: 'API GET - user deleted',
        }
    )
};


