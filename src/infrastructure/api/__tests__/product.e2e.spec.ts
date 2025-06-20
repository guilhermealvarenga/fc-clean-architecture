import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should list all products", async () => {
    const response = await request(app).get("/product");
    expect(response.status).toBe(200);
    expect(response.body.products).toEqual([]);

    const response2 = await request(app).post("/product").send({
      type: "a",
      name: "Product 1",
      price: 100
    });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products).toHaveLength(1);
    expect(listResponse.body.products[0].name).toBe("Product 1");
    expect(listResponse.body.products[0].price).toBe(100);
  });
});
