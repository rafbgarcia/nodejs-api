const times = require("lodash/times")
const { Helpers } = require("../helpers")
const { Statistics } = require("../../lib/statistics")
const { Employee } = require("../../models/employee")

const employees = times(10, (i) => ({
  name: `Employee ${i}`,
  salary: i * 10,
  department: `Dept ${i % 2}`,
  subDepartment: `subDept ${i < 5}`,
  onContract: i < 5,
}))

Helpers.databaseLifecycle()

describe("summary", () => {
  beforeEach(async () => {
    await Employee.insertMany(employees)
  })

  it("returns overall metrics", async function () {
    const result = await Statistics.summary(Employee, ["salary"])

    expect(result).toIncludeSameMembers([
      { _id: [], salary_max: 90, salary_mean: 45, salary_min: 0 },
    ])
  })

  it("allows grouping", async function () {
    const result = await Statistics.summary(Employee, ["salary"], { groups: ["department"] })

    expect(result).toIncludeSameMembers([
      { _id: ["Dept 1"], salary_max: 90, salary_mean: 50, salary_min: 10 },
      { _id: ["Dept 0"], salary_max: 80, salary_mean: 40, salary_min: 0 },
    ])
  })

  it("allows grouping with multiple columns", async function () {
    const result = await Statistics.summary(Employee, ["salary"], {
      groups: ["department", "subDepartment"],
    })

    expect(result).toIncludeSameMembers([
      { _id: ["Dept 0", "subDept true"], salary_max: 40, salary_mean: 20, salary_min: 0 },
      { _id: ["Dept 1", "subDept true"], salary_max: 30, salary_mean: 20, salary_min: 10 },
      { _id: ["Dept 0", "subDept false"], salary_max: 80, salary_mean: 70, salary_min: 60 },
      { _id: ["Dept 1", "subDept false"], salary_max: 90, salary_mean: 70, salary_min: 50 },
    ])
  })

  it("allows filtering", async function () {
    const result = await Statistics.summary(Employee, ["salary"], {
      filters: { onContract: true },
    })

    expect(result).toIncludeSameMembers([
      { _id: [], salary_max: 40, salary_mean: 20, salary_min: 0 },
    ])
  })

  it("allows filtering and grouping", async function () {
    const result = await Statistics.summary(Employee, ["salary"], {
      filters: { onContract: true },
      groups: ["department"],
    })

    expect(result).toIncludeSameMembers([
      { _id: ["Dept 1"], salary_max: 30, salary_mean: 20, salary_min: 10 },
      { _id: ["Dept 0"], salary_max: 40, salary_mean: 20, salary_min: 0 },
    ])
  })
})
