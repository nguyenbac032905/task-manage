const Task  = require("../models/task.model");
module.exports.index = async (req, res) => {
    console.log(req.query);
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
    //search
    const keyword = req.query.title;
    if(keyword){
        find.title = new RegExp(keyword,"i");
    }

    const tasks = await Task.find(find).sort(sort).skip(initPagi.skipTask).limit(initPagi.limitTask);
    res.json(tasks)
}
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const tasks = await Task.findOne({_id: id,deleted: false});
    res.json(tasks)
}
module.exports.changeStatus = async (req,res) => {
    try{
        const id = req.params.id;
        const status = req.body.status;
        await Task.updateOne({_id: id}, {$set: {status: status}});
        res.json({
            code: 200,
            message: "Cap nhat trang thai thanh cong"
        });
    }catch(error){
        res.json({
            code: 400,
            message: "Cap nhat trang thai that bai"
        });
    }
}
module.exports.changeMulti = async (req,res) => {
    try{
        const {ids,key,value} = req.body;
        switch (key) {
            case "status":
                await Task.updateMany({_id: {$in: ids}},{$set: {status: value}});
                res.json({
                    code:200,
                    message: "cap nhat trang thai thanh cong"
                });
            default:
                res.json("khong ton tai");
        }
    }catch(error){
        res.json("cap nhat that bai");
    }
    
}
module.exports.create = async (req,res) => {
    const task = new Task(req.body);
    await task.save();
    res.json({
        code: 200,
        message: "tao thanh cong",
        data: task
    })
}
module.exports.edit = async (req,res) => {
    try{
        const id = req.params.id;
        await Task.updateOne({_id: id},req.body);
        res.json({
            code: 200,
            message: "cap nhat thanh cong"
        })
    }catch(error){
        res.json({
            code: 400,
            message: "khong tim thay san pham"
        })
    }
}