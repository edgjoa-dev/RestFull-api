import { jest } from '@jest/globals';

// Mock del modelo User
const mockUserInstance = {
    save: jest.fn().mockResolvedValue(true),
};

const mockUserClass = jest.fn(() => mockUserInstance);
mockUserClass.find = jest.fn();
mockUserClass.countDocuments = jest.fn();
mockUserClass.findByIdAndUpdate = jest.fn();

// Mock del módulo models/index.js
jest.unstable_mockModule('../../models/index.js', () => ({
    User: mockUserClass
}));

// Importar el controlador DESPUÉS de definir los mocks
const { usersGet, userGet, deleteUser } = await import('../../controllers/users.controller.js');

describe('Users Controller', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
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

    test('usersGet should return 200 and list of users', async () => {
        const mockUsers = [{ name: 'Test User' }];
        const mockTotal = 1;

        // Setup mock chainable: User.find().skip().limit()
        const mockFindChain = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(mockUsers)
        };
        mockUserClass.find.mockReturnValue(mockFindChain);
        mockUserClass.countDocuments.mockResolvedValue(mockTotal);

        req.query = { limit: '10', from: '0' }; // Query params come as strings usually

        await usersGet(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            total: mockTotal,
            limit: '10',
            from: '0',
            users: mockUsers,
        });
    });

    test('usersGet should use default values if query params are missing', async () => {
        const mockUsers = [];
        const mockTotal = 0;

        const mockFindChain = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(mockUsers)
        };
        mockUserClass.find.mockReturnValue(mockFindChain);
        mockUserClass.countDocuments.mockResolvedValue(mockTotal);

        req.query = {}; // No params

        await usersGet(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        // Validar que se usaron los defaults (limit=5, from=0)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            limit: 5,
            from: 0,
            total: 0,
            users: []
        }));
    });

    test('userGet should return 200 and expected json', () => {
        userGet(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'API GET - ID',
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
