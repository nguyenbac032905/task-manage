
const User = require("../models/user.model");

module.exports.requireAuth = async (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.json({
            code: 400,
            message: "khong co header"
        })
        return;
    }
    const token = authHeader.split(" ")[1];
    const user = await User.findOne({token: token, deleted: false}).select("-password");
    if(!(user)){
        res.json({
            code: 400,
            message: "khong co user cua token"
        })
        return;
    }
    req.user = user;
    next();
};