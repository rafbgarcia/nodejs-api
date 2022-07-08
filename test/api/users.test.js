const request = require("supertest")
const app = require("../../app")

describe("POST /users/login", () => {
  it("returns 400 when data is invalid", async () => {
    const errors = {
      username: { value: "", msg: "is required", param: "username", location: "body" },
      password: { msg: "is required", param: "password", location: "body" },
    }

    await request(app).post("/users/login").send({ username: "" }).expect(400, { errors })
  })

  it("returns 401 when credentials are invalid", async () => {
    await request(app)
      .post("/users/login")
      .send({ username: "admin", password: "wrong" })
      .expect(401, { error: "Invalid credentials" })
  })

  it("returns 200 when credentials are valid", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ username: "admin", password: "admin" })
      .expect(200)

    expect(res.body.username).toEqual("admin")
    expect(res.body.token.length > 0).toBe(true)
  })
})
