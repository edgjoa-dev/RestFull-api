import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Define the mock factory
const mockUsersController = {
    usersGet: jest.fn((req, res) => res.status(200).json({ msg: 'Get all users' })),
    userGet: jest.fn((req, res) => res.status(200).json({ msg: 'API GET - ID' })),
    createUser: jest.fn((req, res) => res.status(200).json({ msg: 'Usuario obtenido', name: 'John', lastname: 'Doe' })),
    updateUser: jest.fn((req, res) => res.status(200).json({ msg: 'API GET - update user', id: '123' })),
    deleteUser: jest.fn((req, res) => res.status(200).json({ msg: 'API GET - user deleted' })),
};

// Mock the module BEFORE importing the router
jest.unstable_mockModule('../../controllers/users.controller.js', () => mockUsersController);

// Dynamic import of the router (which imports the controller)
const { default: usersRouter } = await import('../../routes/users.js');
const { usersGet, userGet, createUser, updateUser, deleteUser } = await import('../../controllers/users.controller.js');

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset implementations if needed, but the default mock is fine for now
        // If we want to change implementation per test, we can do it on the imported mocks
    });

    test('GET /api/users should call usersGet controller', async () => {
        const response = await request(app).get('/api/users');
        expect(usersGet).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ msg: 'Get all users' });
    });

    test('GET /api/users/:id should call userGet controller', async () => {
        const response = await request(app).get('/api/users/123');
        expect(userGet).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ msg: 'API GET - ID' });
    });

    test('POST /api/users should call createUser controller', async () => {
        const newUser = { name: 'John', lastname: 'Doe' };
        const response = await request(app).post('/api/users').send(newUser);
        expect(createUser).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ msg: 'Usuario obtenido', name: 'John', lastname: 'Doe' });
    });

    test('PUT /api/users/:id should call updateUser controller', async () => {
        const response = await request(app).put('/api/users/123').send({ name: 'Jane' });
        expect(updateUser).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ msg: 'API GET - update user', id: '123' });
    });

    test('DELETE /api/users/:id should call deleteUser controller', async () => {
        const response = await request(app).delete('/api/users/123');
        expect(deleteUser).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ msg: 'API GET - user deleted' });
    });
});
