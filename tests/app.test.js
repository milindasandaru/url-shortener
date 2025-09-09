const request = require("supertest");
const app = require("../src/app");

describe("URL Shortener APU", () => {
    it("health check works", async () => {
        const res = await request(app).get("/health");
        expect(res.status).toBE(200);
        expect(res.body.ok).toBe(true);
    });

    it("shortens a valid URL", async () => {
        const res = await request(app).post("/shorten").send({ url: "https://example.com" });
        expect(res.status).toBe(200);
        expect(res.body.shortUrl).toMatch(/\/[A-Za-z0-9_-]{6}$/);
    });

    it("rejects invalid URL", async () => {
        const res = await request(app).post("/shorten").send({ url: "not-a-url" });
        expect(res.status).toBe(400);
    });

    it("returns 404 for unknown code", async () => {
        const res = await request(app).get("/nope");
        expect(res.status).toBe(404);
    });
});