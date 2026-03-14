const User=require("../model/user");
const Validate=require('../Utils/validators');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const  Submission=require("../model/Submission");


const register=async (req,res)=>{

    try{
        //Validate The Data

        Validate(req.body);
        console.log(req.body);
        const{firstName, emailId, password}=req.body;
        req.body.role="user";
       req.body.password = await bcrypt.hash(password, 10);
       const user =await  User.create(req.body);
      const token =  jwt.sign({_id:user._id,emailId:emailId, role:"user"},process.env.JWT_KEY,{expiresIn:60*60});
      const reply = {
          firstName:user.firstName,
          emailId:user.emailId,
          _id:user._id,
          role:user.role,
        }

      res.cookie('token',token,{maxAge:60*60*1000});
       res.status(200).json({
        user:reply,
        message:"Register Successfully"
      });
    }
    catch(err){
   console.log("REGISTER ERROR:", err);
   res.status(400).json({
      message: err.message
   });
}
}

const login = async (req,res)=>{
   
    try{
        const {emailId,password}=req.body;
        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");
        const user=await User.findOne({emailId});

        const match=bcrypt.compare(password,user.password);
         if(!match)
            throw new Error("Invalid Credentials");
        const reply = {
          firstName:user.firstName,
          emailId:user.emailId,
          _id:user._id
        }

        const token =  jwt.sign({_id:user._id,emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn:60*60});

      res.cookie('token',token,{maxAge:60*60*1000});
      res.status(201).json({
        user:reply,
        message:"Loggin Successfully"
      });
    } 
    catch(err){
        res.status(401).send("Error: "+err);
    }  
}

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict"
      
    });

    return res.status(200).send( "Logged out successfully");
  
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

const adminRegister=async (req,res)=>{

    try{
        //Validate The Data
        Validate(req.body);
        const{firstName, emailId, password}=req.body;
        req.body.role="admin";
       req.body.password = await bcrypt.hash(password, 10);
       const user =await  User.create(req.body);
      const token =  jwt.sign({_id:user._id,emailId:emailId, role:"admin"},process.env.JWT_KEY,{expiresIn:60*60});

      res.cookie('token',token,{maxAge:60*60*1000});
       res.status(201).send("User Registered Successfully");
    }
    catch(err){
       res.status(400).send("Error: "+err); 
    }
}

const deleteProfile = async(req,res)=>{
   try{
         const userId = req.user._id;

         //deleted by user Schema
         await User.findByIdAndDelete(userId);

         //Submission Schema deleted

        await Submission.deleteMany({userId});
        res.status(200).send("Deleted Successfully");


   }
   catch(err){
         res.status(500).send("Internal Server Error");
   }
}



module.exports = {register, login, logout, adminRegister, deleteProfile};