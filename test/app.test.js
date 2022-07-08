const app = require("../app")
const routers = [require("../api/employees"), require("../api/users")].map(
  (defaultImport) => defaultImport.router
)

const filterRouter = (app, router) => app._router.stack.filter((layer) => layer.handle === router)

it("uses uses defined routers", () => {
  routers.forEach((router) => {
    expect(filterRouter(app, router).length).toEqual(1)
  })
})
