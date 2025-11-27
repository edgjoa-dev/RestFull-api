import request from "supertest";
import Server from "../server.js";

describe("Users API", () => {
    let app;

    beforeAll(() => {
        const server = new Server();
        app = server.app;
    });

    test("GET /api/users should return 200 and list of users", async () => {
        const response = await request(app).get("/api/users");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("msg", "Get all users");
        expect(response.body).toHaveProperty("limit", 1);
    });
});
