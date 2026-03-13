// // const mongoose=require('mongoose');
// const mongoose = require('mongoose');

// async function main(){
//    await mongoose.connect(`${process.env.DB_CONNECT_STRING}`);
// }

// module.exports=main;



require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
  if (!process.env.DB_CONNECT_STRING) {
    throw new Error("DB_CONNECT_STRING is missing");
  }

  await mongoose.connect(process.env.DB_CONNECT_STRING);
  console.log("MongoDB connected");
}

module.exports = main;
