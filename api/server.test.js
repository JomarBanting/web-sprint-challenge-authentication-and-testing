// Write your tests here

const User = require("./jokes/users-joke-model");
const db = require("../data/dbConfig")
const request = require("supertest")
const server = require("./server")

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})
beforeEach(async () => {
    await db.seed.run()
})

test('sanity', () => {
  expect(true).toBe(true)
})

test("environment is testing", () => {
  expect(process.env.NODE_ENV).toBe("testing");
})

describe("find()", () => {
  test("resolve all the users in the table", async () => {
    const result = await User.find();
    expect(result).toHaveLength(1);
  })
})