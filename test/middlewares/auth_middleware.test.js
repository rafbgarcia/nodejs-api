const request = require("supertest")
const express = require("express")
const { authMiddleware } = require("../../middlewares/auth_middleware")
const { Auth } = require("../../lib/auth")

const app = express()
app.use(express.json())
app.get("/", authMiddleware, (req, res) => {
  res.status(200).send("welcome")
})

it("returns 403 when token is not present", async () => {
  await request(app).get("/").expect(403, { error: "This resource requires authentication" })
})

it("returns 401 when token is not valid", async () => {
  await request(app)
    .get("/")
    .set("x-access-token", "invalid")
    .expect(401, { error: "Invalid access token" })
})

it("calls next in stack when token is valid", async () => {
  const userData = Auth.login({ username: "admin", password: "admin" })

  await request(app).get("/").set("x-access-token", userData.token).expect(200, "welcome")
})
