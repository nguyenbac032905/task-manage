const express = require('express');
require("dotenv").config();
const database = require("./config/database");
database.connect();
const Task  = require("./models/task.model");
const app = express();
const port = process.env.PORT;
const routes = require("./routes/index.route");
routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});