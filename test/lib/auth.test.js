require("dotenv").config()
const { Auth } = require("../../lib/auth")

describe("login", () => {
  it("returns false when user can't be found", function () {
    const user = { username: "wrong", password: "wrong" }
    expect(Auth.login(user)).toBe(false)
  })

  it("returns false when password is incorrect", function () {
    const user = { username: "admin", password: "wrong" }
    expect(Auth.login(user)).toBe(false)
  })

  it("returns user data when username and password match", function () {
    const user = { username: "admin", password: "admin" }
    const userData = Auth.login(user)
    expect(userData.username).toEqual("admin")
    expect(userData.token.length > 0).toBe(true)
  })
})
