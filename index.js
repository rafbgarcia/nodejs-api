const http = require("http");
const app = require("./app");
const PORT = 4000;

http.createServer(app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
