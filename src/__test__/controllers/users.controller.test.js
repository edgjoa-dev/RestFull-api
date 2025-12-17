import { jest } from '@jest/globals';

// Mock del modelo User
const mockUserInstance = {
    save: jest.fn().mockResolvedValue(true),
};

const mockUserClass = jest.fn(() => mockUserInstance);
mockUserClass.find = jest.fn();
mockUserClass.countDocuments = jest.fn();
mockUserClass.findByIdAndUpdate = jest.fn();
mockUserClass.findById = jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue({ name: 'Test User', status: true })
});

// Mock del módulo models/index.js
jest.unstable_mockModule('../../models/index.js', () => ({
    User: mockUserClass
}));

// Importar el controlador DESPUÉS de definir los mocks
const { usersGet, userGet, deleteUser, updateUser } = await import('../../controllers/users.controller.js');

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
            users: mockUsers
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
        expect(res.json).toHaveBeenCalledWith({
            total: mockTotal,
            users: mockUsers
        });
    });

    test('userGet should return 200 and expected json', async () => {
        await userGet(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user: { name: 'Test User', status: true }
        });
    });

    test('deleteUser should return 200 and expected json', async () => {
        await deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'User deleted',
            user: undefined, // Since we didn't mock findByIdAndUpdate to return anything
        });
    });

    test('updateUser should return 201 and update user', async () => {
        const mockUpdatedUser = { name: 'Updated Name' };
        mockUserClass.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

        req.params.id = '123';
        req.body = { name: 'Updated Name', role: 'ADMIN_ROLE' };

        await updateUser(req, res);

        expect(mockUserClass.findByIdAndUpdate).toHaveBeenCalledWith('123', { name: 'Updated Name', role: 'ADMIN_ROLE' });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'User updated',
            user: mockUpdatedUser
        });
    });

    test('updateUser should hash password if provided', async () => {
        const mockUpdatedUser = { name: 'Updated Name' };
        mockUserClass.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);

        req.params.id = '123';
        req.body = { password: 'newpassword123' };

        await updateUser(req, res);

        expect(mockUserClass.findByIdAndUpdate).toHaveBeenCalled();
        const updateArgs = mockUserClass.findByIdAndUpdate.mock.calls[0][1];
        expect(updateArgs.password).toBeDefined();
        expect(updateArgs.password).not.toBe('newpassword123');

        expect(res.status).toHaveBeenCalledWith(201);
    });
});
