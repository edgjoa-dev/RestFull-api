import request from "supertest";
import { jest } from '@jest/globals';

// Mockeamos la conexión a la base de datos ANTES de importar el servidor.
// Esto asegura que cuando el servidor intente conectarse, use nuestra versión falsa.
jest.unstable_mockModule('../database/config.db.js', () => ({
    dbConnection: jest.fn().mockResolvedValue(), // Simula una conexión exitosa que no hace nada.
    resetConnectionPromise: jest.fn(),
}));

// Importamos dinámicamente el servidor DESPUÉS de definir el mock.
const Server = (await import('../server.js')).default;

describe("Users API", () => {
    let app;

    beforeAll(async () => {
        const server = new Server(); // Ahora esto usará la dbConnection mockeada
        app = server.app;
    });

    test("GET /api/users should return 200 and list of users", async () => {
        const response = await request(app).get("/api/users");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("msg", "Get all users");
        expect(response.body).toHaveProperty("limit", 1);
    });
});
