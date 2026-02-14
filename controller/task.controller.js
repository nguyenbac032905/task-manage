const Task  = require("../models/task.model");
module.exports.index = async (req, res) => {
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    let find = {deleted: false};
    let sort ={};
    if(status){
        find.status=status;
    }
    if(sortKey && sortValue){
        sort[sortKey]=sortValue;
    }
    console.log(sort)
    const tasks = await Task.find(find).sort(sort);
    res.json(tasks)
}
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const tasks = await Task.findOne({_id: id,deleted: false});
    res.json(tasks)
}