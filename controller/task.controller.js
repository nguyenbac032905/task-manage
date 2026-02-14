const Task  = require("../models/task.model");
module.exports.index = async (req, res) => {
    const status = req.query.status;
    let find = {deleted: false};
    if(status){
        find.status=status;
    }
    const tasks = await Task.find(find);
    res.json(tasks)
}
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const tasks = await Task.findOne({_id: id,deleted: false});
    res.json(tasks)
}