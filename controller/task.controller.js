const Task  = require("../models/task.model");
module.exports.index = async (req, res) => {
    let find = {deleted: false};
    //loc theo trang thai
    const status = req.query.status;
    if(status){
        find.status=status;
    }
    //sap xep theo key
    let sort ={};
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    if(sortKey && sortValue){
        sort[sortKey]=sortValue == "asc" ? 1 : -1;
    }
    //phan trang
    const pageCurrent = parseInt(req.query.page);
    const limitTask = parseInt(req.query.limit);
    const initPagi = {
        currentPage:1,
        limitTask:3
    }
    if(pageCurrent && limitTask){
        initPagi.currentPage = pageCurrent;
        initPagi.limitTask = limitTask;
    }
    initPagi.skipTask = (pageCurrent-1)*limitTask;
    const countTask = await Task.countDocuments({deleted: false});
    initPagi.totalPage = Math.ceil(countTask/initPagi.limitTask);

    const tasks = await Task.find(find).sort(sort).skip(initPagi.skipTask).limit(initPagi.limitTask);
    res.json(tasks)
}
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const tasks = await Task.findOne({_id: id,deleted: false});
    res.json(tasks)
}