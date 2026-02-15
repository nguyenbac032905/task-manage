const express = require('express');
require("dotenv").config();
const database = require("./config/database");
database.connect();
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const routes = require("./routes/index.route");
routes(app);
const cors = require('cors')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});