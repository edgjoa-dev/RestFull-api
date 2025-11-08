const { request, response } = require('express');

const usersGet = (req = request, res = response) => {
    res.status(200).json(
        {
            msg: 'API GET - ALL',
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
    res.status(200).json(
        {
            msg: 'API GET - user created',
        }
    )
};


const updateUser = (req = request, res = response) => {
    res.status(200).json(
        {
            msg: 'API GET - update user',
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