const User = require("../models/user.model");
const md5 = require("md5");
const generateHelper = require("../helpers/generate");
const Otp = require("../models/forgot-password.model");
const sendMailHelper = require("../helpers/sendMail");
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
module.exports.forgot = async (req,res) => {
    const otp = generateHelper.generateRandomNumber(6);
    const objectForgot = {
        email: req.body.email,
        otp: otp,
        expireAt: Date.now()
    }
    const recordOtp = new Otp(objectForgot);
    recordOtp.save();
    // const subject = "Mã otp xác minh mật khẩu";
    // const html = `Mã otp là: <b>${recordOtp.otp}</b>. Thời hạn là 5p`;
    // sendMailHelper.sendMail(otp.email, subject, html);
    res.json({
        code: 200,
        message: "Gui ma otp thanh cong"
    })
}
module.exports.otp = async (req,res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const recordOtp = await Otp.findOne({email: email,otp: otp});
    if(!recordOtp){
        res.json({
            code: 400,
            message: "sai otp"
        })
        return;
    }
    const user = await User.findOne({email: email});
    res.cookie("token", user.token);
    res.json({
        code: 200,
        message: "thanh cong",
        token: user.token
    })
}
module.exports.reset = async (req,res) => {
    const token = req.body.token;
    const password = md5(req.body.password);
    await User.updateOne({token: token},{$set: {password: password}});
    res.json({
        code: 200,
        message: "thanh cong"
    })
}
module.exports.detail = async (req,res) => {
    const token = req.user.token;
    const user = await User.findOne({token: token, deleted: false}).select("-password -token")
    res.json({
        code: 200,
        message: "Thanh cong",
        user: user
    })
}
module.exports.list = async (req,res) => {
    const users = await User.find({deleted: false}).select("fullName email");
    res.json({
        code: 200,
        message: "Thanh cong",
        users: users
    })
}