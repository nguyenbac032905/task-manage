const User = require("../models/user.model");
const md5 = require("md5");
module.exports.register = async (req,res) => {
    try{
        const existUser = await User.findOne({email: req.body.email, deleted: false});
        if(existUser){
            res.json({
                code: 400,
                message: "email da ton tai"
            })
            return;
        }
        req.body.password = md5(req.body.password);
        const user = new User(req.body);
        user.save();
        res.cookie("token", user.token);
        res.json({
            code: 200,
            message: "tao thanh cong",
            token: user.token
        })
    }catch(error){
        res.json({
            code: 400,
            message: "vui long thu lai"
        })
    }
}
module.exports.login = async (req,res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await User.findOne({email: email, deleted: false});
    if(!user){
        res.json({
            code: 400,
            message: "khong ton tai email"
        });
        return;
    }
    if(user.password != password){
        res.json({
            code: 400,
            message: "sai mat khau"
        });
        return;
    }
    res.cookie("token", user.token);
    res.json({
        code: 200,
        message: "dang nhap thanh cong",
        user: user
    });
}