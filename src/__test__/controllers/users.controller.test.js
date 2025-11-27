import { jest } from '@jest/globals';
import { usersGet, userGet, createUser, updateUser, deleteUser } from '../../controllers/users.controller.js';

describe('Users Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {},
            body: {},
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('usersGet should return 200 and expected json', () => {
        req.query = { name: 'John', lastname: 'Doe', page: 1, limit: 10 };

        usersGet(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Get all users',
            name: 'John',
            lastname: 'Doe',
            page: 1,
            limit: 10,
        });
    });

    test('usersGet should use default limit if not provided', () => {
        req.query = { name: 'John' };

        usersGet(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Get all users',
            name: 'John',
            lastname: undefined,
            page: undefined,
            limit: 1,
        });
    });

    test('userGet should return 200 and expected json', () => {
        userGet(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'API GET - ID',
        });
    });

    test('createUser should return 200 and expected json', () => {
        req.body = { name: 'John', lastname: 'Doe' };

        createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Usuario obtenido',
            name: 'John',
            lastname: 'Doe',
        });
    });

    test('updateUser should return 200 and expected json', () => {
        req.params = { id: '123' };

        updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'API GET - update user',
            id: '123',
        });
    });

    test('deleteUser should return 200 and expected json', () => {
        deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'API GET - user deleted',
        });
    });
});
