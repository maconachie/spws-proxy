const request = require("supertest");

describe("Server functionality", () => {
  test('GET / should return status 200"', async () => {
    const response = await request("http://localhost:5070/").get("/");
    expect(response.status).toBe(200);
    console.log(response);
  });
});
