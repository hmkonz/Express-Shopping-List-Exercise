process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let mustard = { name: "Mustard", price: 2.5 };

beforeEach(function () {
  items.push(mustard);
});

afterEach(function () {
  // empty out the 'items' array (clears the contents of the array)
  items.length = 0;
});

/** GET /items - returns `{items: [item, ...]}` */

describe("GET /items", () => {
  test("Get a list of all items", async () => {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ items: [mustard] });
    expect(items).toHaveLength(1);
  });
});

/** GET /items/[name] - return data about one item: `{item: item}` */

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const resp = await request(app).get(`/items/${mustard.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(mustard);
  });
  test("Responds with 404 for invalid item", async () => {
    const resp = await request(app).get(`/items/ketchup`);
    expect(resp.statusCode).toBe(404);
  });
});

/** POST /items - create item from data; return `{item: item}` */

describe("POST /items", () => {
  test("Creates a new item", async () => {
    const resp = await request(app)
      .post("/items")
      .send({ name: "Lettuce", price: 4.99 });
    expect(resp.statusCode).toBe(201);
    console.log(resp.body);
    console.log(resp.body.added.name);
    console.log(resp.body.added.price);
    expect(resp.body).toEqual({ added: { name: "Lettuce", price: 4.99 } });
    expect(resp.body.added.price).toEqual(4.99);
  });
  test("Responds with 400 if name is missing", async () => {
    const resp = await request(app).post("/items").send({});
    expect(resp.statusCode).toBe(400);
  });
});

/** PATCH /items/[name] - update item; return `{item: item}` */

describe("/PATCH /items/:name", () => {
  test("Updates an item's name", async () => {
    const resp = await request(app)
      .patch(`/items/${mustard.name}`)
      .send({ name: "Grey Poupon Mustard" });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ Updated: { name: "Grey Poupon Mustard" } });
  });
  test("Responds with 404 if can't find item", async () => {
    const resp = await request(app)
      .patch(`/items/Carrots`)
      .send({ name: "Baby Carrots" });
    expect(resp.statusCode).toBe(404);
  });
});

/** DELETE /items/[name] - delete item,
 *  return `{message: "Deleted"}` */

describe("/DELETE /items/:name", () => {
  test("Deletes a specific item", async () => {
    const resp = await request(app).delete(`/items/${mustard.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const resp = await request(app).delete(`/items/apples`);
    expect(resp.statusCode).toBe(404);
  });
});
