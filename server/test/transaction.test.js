const request = require("supertest");
const app = require("../server"); // Your Express app entry point
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
require("dotenv").config();

// Sample token (replace with real JWT token for testing)
const token = process.env.JWT_TEST_TOKEN;

describe("Transaction API", () => {
  beforeAll(async () => {
    // Connect to test DB if needed
  });

  afterAll(async () => {
    // Disconnect after tests
    await mongoose.disconnect();
  });

  it("should add a new transaction", async () => {
    const response = await request(app)
      .post("/api/transactions/add")
      .set("Authorization", token)
      .send({
        title: "July Salary", // ✅ Required field added
        amount: 2000,
        type: "income",
        category: "Salary",
        date: "2025-07-01",
      });

    console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });

  it("should fetch all user transactions", async () => {
    const response = await request(app)
      .get("/api/transactions/get")
      .set("Authorization", token);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should get transaction summary", async () => {
    const response = await request(app)
      .get("/api/transactions/summary")
      .set("Authorization", token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("balance");
  });
});
