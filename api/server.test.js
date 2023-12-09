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
  await db.seed.run();
})

// describe("find()", () => {
//   test("resolve all the users in the table", async () => {
//     const result = await User.find();
//     expect(result).toHaveLength(1);
//   })
//   test("testing matching data", async () => {
//     const result = await User.find();
//     expect(result[0].username).toBe("admin")
//   })
// })

// describe("findById()", () => {
//   test("resolving findById in the table", async () => {
//     const result = await User.findById(1);
//     expect(result.username).toBe("admin")
//   })
// })

describe("[GET] /api/auth/users", () => {
  test("response with 200 Ok", async () => {
    const res = await request(server).get("/api/auth/users")
    expect(res.status).toBe(200)
  })
  test("response with all the users", async () => {
    const res = await request(server).get("/api/auth/users")
    expect(res.body[0].username).toBe("admin")
  })
})

describe("[POST] /api/auth/register", () => {
  const newUser = { username: "test", password: "12345" }
  test("response with 201 Ok", async () => {
    const res = await request(server).post("/api/auth/register").send(newUser)
    expect(res.status).toBe(201)
  })
  test("adds the newUser to the table", async () => {
    expect(await db("users")).toHaveLength(1)
    await request(server).post("/api/auth/register").send(newUser)
    expect(await db("users")).toHaveLength(2)
  })
})

describe("[POST] /api/auth/login", () => {
  const admin = {username: "admin", password: "1234"}
  test("response with 200 Ok", async () => {
    const res = await request(server).post("/api/auth/login").send(admin)
    expect(res.status).toBe(200)
  })
  test("verify token existance", async () => {
    const res = await request(server).post("/api/auth/login").send(admin)
    expect(res.body.token).toBeTruthy()
  })
})

describe("[DELETE] /api/auth/users/:id", () => {
  const newUser = { username: "test", password: "12345" }
  test("response with 200 Ok", async () => {
    const res = await request(server).delete("/api/auth/users/1")
    expect(res.status).toBe(200)
  })
  test("check if the object is actually deleted", async () => {
    await db("users").insert(newUser)
    expect(await db("users")).toHaveLength(2)
    await request(server).delete("/api/auth/users/1")
    expect(await db("users")).toHaveLength(1)
  })
})

describe("[PUT] /api/auth/users/:id", () => {
  const newUser = { username: "test", password: "12345" }
  test("response with 200 Ok", async () => {
    const res = await request(server).put("/api/auth/users/1").send(newUser)
    expect(res.status).toBe(200)
  })
  test("check if the update is successful", async () => {
    const res = await request(server).put("/api/auth/users/1").send(newUser)
    expect(res.body.username).toBe("test")
  })
})

