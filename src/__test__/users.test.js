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
mockUserClass.findOne = jest.fn();

jest.unstable_mockModule('../models/index.js', () => ({
    User: mockUserClass,
    Role: { findOne: jest.fn() } // Mock Rol también por si acaso
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
});
