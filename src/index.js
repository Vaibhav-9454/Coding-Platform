
require('dotenv').config();
const express=require('express');

const app=express();

const main = require('./config/db')
const cookieParser=require('cookie-parser');
const authRouter=require("./routes/userAuth");
const problemRouter=require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const cors = require('cors');
require("dotenv").config();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json());
app.use(cookieParser());
// console.log(" authRouter =", authRouter);

app.use('/user',authRouter);
app.use('/problem' ,problemRouter);
app.use('/submission' , submitRouter);
app.use('/ai',aiRouter);



main()
.then(()=>{
app.listen(process.env.PORT, ()=>{
    console.log("Server listening at port number: "+process.env.PORT);
})
})

.catch(err=>console.log("Error occured: "+err));
