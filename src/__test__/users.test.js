import request from "supertest";
import { jest } from '@jest/globals';

// Mock de DB Connection
jest.unstable_mockModule('../database/config.db.js', () => ({
    dbConnection: jest.fn().mockResolvedValue(),
    resetConnectionPromise: jest.fn(),
}));

// Mock de Modelo User
const mockUserInstance = {
    save: jest.fn().mockResolvedValue(true),
};
const mockUserClass = jest.fn(() => mockUserInstance);
mockUserClass.find = jest.fn();
mockUserClass.countDocuments = jest.fn();
mockUserClass.findByIdAndUpdate = jest.fn();
mockUserClass.findById = jest.fn();
mockUserClass.findOne = jest.fn();

// Mock Role
const mockRoleClass = {
    findOne: jest.fn()
};

jest.unstable_mockModule('../models/index.js', () => ({
    User: mockUserClass,
    Role: mockRoleClass
}));

// Importar servidor dinámicamente
const Server = (await import('../server.js')).default;

describe("Users API Integration", () => {
    let app;

    beforeAll(async () => {
        const server = new Server();
        app = server.app;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GET /api/users should return 200 and list of users structure", async () => {
        const mockUsers = [{ name: 'Test User' }];
        const mockTotal = 1;

        const mockFindChain = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(mockUsers)
        };
        mockUserClass.find.mockReturnValue(mockFindChain);
        mockUserClass.countDocuments.mockResolvedValue(mockTotal);

        const response = await request(app).get("/api/users");

        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(mockTotal);
        expect(response.body.users).toHaveLength(1);
        expect(response.body.users[0]).toMatchObject({ name: 'Test User' });
    });

    test("PUT /api/users/:id should return 201 and updated user", async () => {
        const mockUpdatedUser = { name: 'Updated' };
        const validId = '63d1f1c24d15671788223123';

        // Validation: ID exists
        mockUserClass.findById.mockResolvedValue({ _id: validId, name: 'Old Name' });
        // Validation: Role exists
        mockRoleClass.findOne.mockResolvedValue({ role: 'USER_ROLE' });

        // Controller: Update
        mockUserClass.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

        const response = await request(app).put(`/api/users/${validId}`).send({
            name: 'Updated',
            role: 'USER_ROLE'
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.user).toMatchObject(mockUpdatedUser);
    });

    test("DELETE /api/users/:id should return 200 and success message", async () => {
        const validId = '63d1f1c24d15671788223123';

        // Validation: ID exists
        mockUserClass.findById.mockResolvedValue({ _id: validId, name: 'To Delete', status: true });

        // Controller: Delete (soft delete)
        mockUserClass.findByIdAndUpdate.mockResolvedValue({ _id: validId, status: false });

        const response = await request(app).delete(`/api/users/${validId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.msg).toBe('No hay token en la petición');
    });
});
