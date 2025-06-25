import express from 'express';
import "dotenv/config";
import mongoose from 'mongoose';
import expressApp from './express-app.js';

const app = express();




await expressApp(app);

app.listen(process.env.PORT,()=>{
  console.log("Server is running on port 8001");
})

mongoose.connect(process.env.MONGO_URI ).then(()=>{
  console.log("Connected to MongoDB")
}).catch(error=> console.error(error));