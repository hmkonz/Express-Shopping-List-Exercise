// defines app by importing app.js file where app is defined ('const app = express();')

const app = require("./app");

app.listen(3000, function () {
  console.log("Server starting on port 3000");
});
