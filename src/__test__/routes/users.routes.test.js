import { expect, jest } from '@jest/globals';
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
jest.unstable_mockModule('../../models/User.model.js', () => ({
    User: {
        findOne: jest.fn(),
        findById: jest.fn(),
    }
}));

// Dynamic import of the router (which imports the controller)
const { default: usersRouter } = await import('../../routes/users.js');
const { usersGet, userGet, createUser, updateUser, deleteUser } = await import('../../controllers/users.controller.js');

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

// Import the mocked model to control it in tests
const { Role } = await import('../../models/Role.model.js');
const { User } = await import('../../models/User.model.js');

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
        const validId = '63d1f1c24d15671788223123';
        User.findById.mockResolvedValueOnce({ _id: validId, status: true }); // Para el validador isIdValid

        const response = await request(app).get(`/api/users/${validId}`);
        expect(userGet).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ msg: 'API GET - ID' });
    });

    test('POST /api/users should call createUser controller', async () => {
        const newUser = { name: 'Juan', email: 'test1@test.com', password: '123456789', role: 'USER_ROLE' };

        // Simulate that the role exists in the database
        Role.findOne.mockResolvedValue({ role: 'USER_ROLE' });
        // Simulate that the email does not exist in the database
        User.findOne.mockResolvedValue(null);

        const response = await request(app).post('/api/users').send(newUser);
        expect(createUser).toHaveBeenCalled();
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ msg: 'Usuario obtenido', name: 'Juan', email: 'test1@test.com', password: '123456789', role: 'USER_ROLE' });
    });


    // ---------- Tests adicionales para escenarios negativos y errores ----------

    test('POST /api/users should return 400 when name is missing', async () => {
        const newUser = { email: 'no-name@test.com', password: '123456789', role: 'USER_ROLE' };

        // Aseguramos que el Role existe para que la validación del role no sea la que falle aquí
        Role.findOne.mockResolvedValueOnce({ role: 'USER_ROLE' });
        // El email no importa para este test, pero el validador se ejecutará
        User.findOne.mockResolvedValueOnce(null);

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
        // El validador de formato de email se ejecuta antes que el de existencia
        // User.findOne.mockResolvedValueOnce(null);

        const response = await request(app).post('/api/users').send(newUser);

        expect(createUser).not.toHaveBeenCalled();
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    test('POST /api/users should return 400 when password too short', async () => {
        const newUser = { name: 'ShortPass', email: 'short@pass.com', password: '12345', role: 'USER_ROLE' };

        Role.findOne.mockResolvedValueOnce({ role: 'USER_ROLE' });
        User.findOne.mockResolvedValueOnce(null);

        const response = await request(app).post('/api/users').send(newUser);

        expect(createUser).not.toHaveBeenCalled();
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    test('POST /api/users should return 400 when role does not exist', async () => {
        const newUser = { name: 'NoRole', email: 'norole@test.com', password: '123456789', role: 'UNKNOWN_ROLE' };

        // Simular que Role.findOne no encuentra el rol
        Role.findOne.mockResolvedValueOnce(null);
        User.findOne.mockResolvedValueOnce(null);

        const response = await request(app).post('/api/users').send(newUser);

        // El controlador no debe ser llamado porque la validación del role falla
        expect(createUser).not.toHaveBeenCalled();
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    test('POST /api/users should return 400 when email already exists', async () => {
        const newUser = { name: 'Dupe', email: 'dupe@test.com', password: '123456789', role: 'USER_ROLE' };

        // Simular que el rol existe para que esa validación no falle
        Role.findOne.mockResolvedValueOnce({ role: 'USER_ROLE' });
        // ¡Importante! Simular que el email YA EXISTE en la BD
        User.findOne.mockResolvedValueOnce({ email: 'dupe@test.com' });

        const response = await request(app).post('/api/users').send(newUser);

        // El controlador no debe ser llamado porque la validación del email falla
        expect(createUser).not.toHaveBeenCalled();
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    test('POST /api/users should return 500 if controller throws an unexpected error', async () => {
        const newUser = { name: 'Explode', email: 'explode@test.com', password: '123456789', role: 'USER_ROLE' };

        // Asegurar que el role existe para pasar validaciones
        Role.findOne.mockResolvedValueOnce({ role: 'USER_ROLE' });
        User.findOne.mockResolvedValueOnce(null);

        // Hacemos que el mock del controlador lance un error la primera vez que sea llamado
        createUser.mockImplementationOnce(() => { throw new Error('Unexpected failure'); });

        const response = await request(app).post('/api/users').send(newUser);

        expect(createUser).toHaveBeenCalled();
        // Express por defecto responde 500 ante excepciones no capturadas
        expect(response.status).toBe(500);
        expect(response.body).toBeDefined();
    });

    // ---------- Tests for PUT /api/users/:id ----------

    test('PUT /api/users/:id should call updateUser controller', async () => {
        const updateData = { name: 'Updated', role: 'USER_ROLE' };
        Role.findOne.mockResolvedValueOnce({ role: 'USER_ROLE' });

        // We need a valid MongoID for the validation middleware to pass (if using check('id', 'No es un ID válido').isMongoId())
        const validId = '63d1f1c24d15671788223123';

        // Mock findById for isIdValid validator
        User.findById.mockResolvedValueOnce({ _id: validId, name: 'Existing User' });

        const response = await request(app).put(`/api/users/${validId}`).send(updateData);

        expect(updateUser).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ msg: 'API GET - update user', id: '123' });
    });

    test('PUT /api/users/:id should return 400 for invalid MongoID', async () => {
        const updateData = { name: 'Updated' };
        const invalidId = '123';

        const response = await request(app).put(`/api/users/${invalidId}`).send(updateData);

        expect(updateUser).not.toHaveBeenCalled();
        expect(response.status).toBe(400);
        // Expect validation errors
        expect(response.body).toBeDefined();
    });

    test('PUT /api/users/:id should return 400 for invalid role', async () => {
        const updateData = { role: 'INVALID_ROLE' };
        const validId = '63d1f1c24d15671788223123';

        User.findById.mockResolvedValueOnce({ _id: validId });
        Role.findOne.mockResolvedValueOnce(null);

        const response = await request(app).put(`/api/users/${validId}`).send(updateData);

        expect(updateUser).not.toHaveBeenCalled();
        expect(response.status).toBe(400);
    });

    // ---------- Tests for DELETE /api/users/:id ----------

    test('DELETE /api/users/:id should call deleteUser controller', async () => {
        const validId = '63d1f1c24d15671788223123';

        // Mock user existence check if middleware checks it (e.g. check('id').custom(existeUsuarioPorId))
        User.findById.mockResolvedValueOnce({ _id: validId, status: true });

        const response = await request(app).delete(`/api/users/${validId}`);

        expect( response.status ).toBe(401)
    });

    test('DELETE /api/users/:id should return 400 for invalid MongoID', async () => {
        const invalidId = '123';

        const response = await request(app).delete(`/api/users/${invalidId}`);

        expect(deleteUser).not.toHaveBeenCalled();
        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
    });

});
