process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("./app");
let cats = require("./fakeDb");

let mustard = { name: "Mustard", price: "2.50" };

beforeEach(function () {
  items.push(mustard);
});

afterEach(function () {
  // empty out the 'items' array (clears the contents of the array)
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ items: [mustard] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const resp = await request(app).get(`/items/${mustard.name}`);
    expect(resp.statusCode).toBe(200);
    console.log(mustard);
    expect(resp.body).toEqual({ mustard });
  });
  test("Responds with 404 for invalid item", async () => {
    const resp = await request(app).get(`/items/ketchup`);
    expect(resp.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating an item", async () => {
    const resp = await request(app).post("/items").send({ name: "Lettuce" });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({ added: { name: "Lettuce" } });
  });
  test("Responds with 400 if name is missing", async () => {
    const resp = await request(app).post("/items").send({});
    expect(resp.statusCode).toBe(400);
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating an item's name", async () => {
    const resp = await request(app)
      .patch(`/items/${mustard.name}`)
      .send({ name: "Grey Poupon Mustard" });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ Updated: { name: "Grey Poupon Mustard" } });
  });
  test("Responds with 404 for invalid name", async () => {
    const resp = await request(app)
      .patch(`/items/Carrots`)
      .send({ name: "Baby Carrots" });
    expect(resp.statusCode).toBe(404);
  });
});

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const resp = await request(app).delete(`/items/${mustard.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const resp = await request(app).delete(`/items/apples`);
    expect(resp.statusCode).toBe(404);
  });
});
