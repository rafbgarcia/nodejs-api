const request = require("supertest")
const mongoose = require("mongoose")
const app = require("../../app")
const { Employee } = require("../../models/employee")
const { Helpers } = require("../helpers")
const { router: employeesRouter } = require("../../api/employees")
const { authMiddleware } = require("../../middlewares/auth_middleware")

Helpers.databaseLifecycle()

const newEmployee = {
  name: "Employee",
  currency: "Employee",
  salary: 10,
  department: "Dept",
  subDepartment: "subDept",
  onContract: false,
}

it("requires authentication", () => {
  expect(employeesRouter.stack[0].handle).toBe(authMiddleware)
})

describe("POST /employees", () => {
  const authenticatedRequest = () => Helpers.authenticated(request(app).post("/employees"))

  it("returns 400 with errors when data is invalid", async () => {
    const errors = {
      errors: {
        currency: { location: "body", msg: "is required", param: "currency" },
        department: { location: "body", msg: "is required", param: "department" },
        name: { location: "body", msg: "is required", param: "name", value: "" },
        salary: { location: "body", msg: "is required", param: "salary" },
        subDepartment: { location: "body", msg: "is required", param: "subDepartment" },
      },
    }

    const res = await authenticatedRequest().send({ name: "" }).expect(400)
    expect(res.body).toEqual(errors)
    expect(await Employee.count()).toEqual(0)
  })

  it("creates an employee when data is valid", async () => {
    expect(await Employee.count()).toEqual(0)
    const res = await authenticatedRequest().send(newEmployee).expect(201)
    const record = await Employee.findOne()

    expect(await Employee.count()).toEqual(1)
    expect(res.body.id).toEqual(newEmployee.id)
    expect(record.name).toEqual(newEmployee.name)
  })
})

describe("DELETE /employees/:name", () => {
  const authenticatedRequest = (path) => Helpers.authenticated(request(app).delete(path))

  it("Idempotently deletes an employee", async () => {
    await authenticatedRequest(`/employees/${mongoose.Types.ObjectId()}`).expect(204, {})

    expect(await Employee.count()).toEqual(0)
    const employee = await Employee.create(newEmployee)
    expect(await Employee.count()).toEqual(1)

    await authenticatedRequest(`/employees/${employee.id}`).expect(204, {})
    expect(await Employee.count()).toEqual(0)
  })
})

describe("GET /employees/statistics", () => {
  const { Statistics } = require("../../lib/statistics")

  it("calls Statistics.summary with params", async () => {
    const StatisticsSpy = jest.spyOn(Statistics, "summary")

    const query = [
      "columns[]=salary",
      "groups[]=department",
      "groups[]=subDepartment",
      "filters[onContract]=true",
    ].join("&")

    await Helpers.authenticated(request(app).get(`/employees/statistics?${query}`)).expect(200, [])
    expect(StatisticsSpy).toHaveBeenCalledWith(Employee, ["salary"], {
      filters: { onContract: true },
      groups: ["department", "subDepartment"],
    })

    StatisticsSpy.mockRestore()
  })
})
