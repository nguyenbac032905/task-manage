const taskRoutes = require("./task.route");
const userRoutes = require("./user.route");
const authMiddleware = require("../middlewares/auth.middleware");
module.exports = (app) => {
    app.use("/tasks",authMiddleware.requireAuth,taskRoutes);
    app.use("/users", userRoutes);
}