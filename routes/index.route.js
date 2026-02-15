const taskRoutes = require("./task.route");
const userRoutes = require("./user.route");
module.exports = (app) => {
    app.use("/tasks",taskRoutes);
    app.use("/users", userRoutes);
}