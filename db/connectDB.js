import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

mongoose.connect(process.env.DB_HOST,{
    useUnifiedTopology:true,
    useCreateIndex:true,
    useNewUrlParser:true
  });
  
  mongoose.connection.on('connected',()=>{
    console.log("Mongoose default connection is open")
  })
  
  mongoose.connection.on('error',(err)=>{
    console.error('Failed to connect',err)
  })
  
  mongoose.connection.on('disconnected',()=>{
    console.log('Mongoose default connection is disconnected');
  })