//const { request, response } = require('express');
import { request, response} from "express";

export const usersGet = (req = request, res = response) => {

    const {name, lastname, page, limit = 1 } = req.query

    res.status(200).json(
        {
            msg: 'Get all users',
            name,
            lastname,
            page,
            limit,
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

export const createUser = (req = request, res = response) => {

    const { name, lastname } = req.body;

    res.status(200).json(
        {
            msg: 'Usuario obtenido',
            name,
            lastname,
        }
    )
};


export const updateUser = (req = request, res = response) => {

    const id = req.params.id

    res.status(200).json(
        {
            msg: 'API GET - update user',
            id
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


