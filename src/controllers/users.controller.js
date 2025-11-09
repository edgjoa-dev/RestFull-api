const { request, response } = require('express');

const usersGet = (req = request, res = response) => {

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

const userGet = (req = request, res = response) => {
    res.status(200).json(
        {
            msg: 'API GET - ID',
        }
    )
};

const createUser = (req = request, res = response) => {

    const { name, lastname } = req.body;

    res.status(200).json(
        {
            msg: 'Usuario obtenido',
            name,
            lastname,
        }
    )
};


const updateUser = (req = request, res = response) => {

    const id = req.params.id

    res.status(200).json(
        {
            msg: 'API GET - update user',
            id
        }
    )
};

const deleteUser = (req = request, res = response) => {
    res.status(200).json(
        {
            msg: 'API GET - user deleted',
        }
    )
};


module.exports = {
    usersGet,
    userGet,
    createUser,
    updateUser,
    deleteUser
};