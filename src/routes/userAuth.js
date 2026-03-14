const express=require('express');
const authRouter=express.Router();


const {register, login, logout, adminRegister, deleteProfile}=require('../controllers/userAuthent');
const adminMiddleware=require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

authRouter.post('/register',register);//Register
authRouter.post('/login',login);//login
authRouter.post('/logout', userMiddleware, logout);//logout
authRouter.post('/admin/register',adminMiddleware,adminRegister);
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);
authRouter.get('/check',userMiddleware, (req,res)=>{
    const reply={
        firstName:req.user.firstName,

        emailId:req.user.emailId,
        _id:req.user._id,
        role:req.user.role,
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})
//authRouter.get('/getProfile',getProfile);//Myprofile

module.exports=authRouter;