import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Define the mock factory
const mockUsersController = {
    usersGet: jest.fn((req, res) => res.status(200).json({ msg: 'Get all users' })),
    userGet: jest.fn((req, res) => res.status(200).json({ msg: 'API GET - ID' })),
    createUser: jest.fn((req, res) => res.status(201).json({ msg: 'Usuario obtenido', name: 'Juan', email: 'test1@test.com', password: '123456789', role: 'USER_ROLE' })),
    updateUser: jest.fn((req, res) => res.status(200).json({ msg: 'API GET - update user', id: '123' })),
    deleteUser: jest.fn((req, res) => res.status(200).json({ msg: 'API GET - user deleted' })),
};

// Mock the module BEFORE importing the router
jest.unstable_mockModule('../../controllers/users.controller.js', () => mockUsersController);
jest.unstable_mockModule('../../models/Role.model.js', () => ({
    Role: { findOne: jest.fn() }
}));

// Dynamic import of the router (which imports the controller)
const { default: usersRouter } = await import('../../routes/users.js');
const { usersGet, userGet, createUser, updateUser, deleteUser } = await import('../../controllers/users.controller.js');

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

// Import the mocked model to control it in tests
const { Role } = await import('../../models/Role.model.js');

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
        const newUser = { name: 'Juan', email: 'test1@test.com', password: '123456789', role: 'USER_ROLE' };
        
        // Simulate that the role exists in the database
        Role.findOne.mockResolvedValue({ role: 'USER_ROLE' });

        const response = await request(app).post('/api/users').send(newUser);
        expect(createUser).toHaveBeenCalled();
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ msg: 'Usuario obtenido', name: 'Juan', email: 'test1@test.com', password: '123456789', role: 'USER_ROLE' });
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

    // ---------- Tests adicionales para escenarios negativos y errores ----------

test('POST /api/users should return 400 when name is missing', async () => {
    const newUser = { email: 'no-name@test.com', password: '123456789', role: 'USER_ROLE' };

    // Aseguramos que el Role existe para que la validación del role no sea la que falle aquí
    Role.findOne.mockResolvedValueOnce({ role: 'USER_ROLE' });

    const response = await request(app).post('/api/users').send(newUser);

    // createUser NO debe ser llamado porque la validación falla antes
    expect(createUser).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    // Sólo comprobamos que hay errores en el body (forma común de fieldValidator)
    expect(response.body).toBeDefined();
});

test('POST /api/users should return 400 when email is invalid', async () => {
    const newUser = { name: 'NoEmail', email: 'not-an-email', password: '123456789', role: 'USER_ROLE' };

    Role.findOne.mockResolvedValueOnce({ role: 'USER_ROLE' });

    const response = await request(app).post('/api/users').send(newUser);

    expect(createUser).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
});

test('POST /api/users should return 400 when password too short', async () => {
    const newUser = { name: 'ShortPass', email: 'short@pass.com', password: '12345', role: 'USER_ROLE' };

    Role.findOne.mockResolvedValueOnce({ role: 'USER_ROLE' });

    const response = await request(app).post('/api/users').send(newUser);

    expect(createUser).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
});

test('POST /api/users should return 400 when role does not exist', async () => {
    const newUser = { name: 'NoRole', email: 'norole@test.com', password: '123456789', role: 'UNKNOWN_ROLE' };

    // Simular que Role.findOne no encuentra el rol
    Role.findOne.mockResolvedValueOnce(null);

    const response = await request(app).post('/api/users').send(newUser);

    // El controlador no debe ser llamado porque la validación del role falla
    expect(createUser).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
});

test('POST /api/users should return 500 if controller throws an unexpected error', async () => {
    const newUser = { name: 'Explode', email: 'explode@test.com', password: '123456789', role: 'USER_ROLE' };

    // Asegurar que el role existe para pasar validaciones
    Role.findOne.mockResolvedValueOnce({ role: 'USER_ROLE' });

    // Hacemos que el mock del controlador lance un error la primera vez que sea llamado
    createUser.mockImplementationOnce(() => { throw new Error('Unexpected failure'); });

    const response = await request(app).post('/api/users').send(newUser);

    expect(createUser).toHaveBeenCalled();
    // Express por defecto responde 500 ante excepciones no capturadas
    expect(response.status).toBe(500);
    expect(response.body).toBeDefined();
});

});
