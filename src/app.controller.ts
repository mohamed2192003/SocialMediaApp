import express from "express"
import cors from "cors"
import type { Express, Request, Response } from "express"
import { authRouter, userRouter } from "./modules/index.js"
import { globalErrorHandler } from "./middleware/error.middleware.js"
import { env } from "./config/env.service.js"
import DBConnection from "./database/connection.js"
import { redisConnection } from "./common/services/redis.service.js"
import userModel from "./database/model/user.model.js"
import { SuccessResponse } from "./common/exeptions/success.response.js"
import { BadRequestExeption } from "./common/exeptions/application.exeption.js"
import {pipeline} from "stream"
import { promisify } from "util"
import { s3Service, S3Service } from "./common/services/s3.service.js"
const s3GetPipe = promisify(pipeline)
export const bootstrap = async () => {
  try{
  const app: Express = express()
  app.use(cors(), express.json())
  await DBConnection()
  await redisConnection.connect()
  // let user = new userModel({
  //     firstName: "John",
  //     lastName: "Doe", 
  //     email: "john.doe@example.com",
  //     password: "password123",
  //     phone: "1234567890"
  // })
  // await user.save()
  // await userModel.insertMany([{
  //     firstName: "Mohamed",
  //     lastName: "Shawky", 
  //     email: "mohamed.shawky@example.com",
  //     password: "password123",
  //     phone: "1234567890"
  // }])
  // let newUser = await userModel.findById(user._id)
  // if(!newUser){
  //     throw new Error("User Not Found")
  // }
  // newUser.firstName = "Wade"
  // await newUser.save()
  // await userModel.findOne({
  //     email: 'john.doe@example.com',
  //     admin: true
  // })
  // await user?.updateOne({
  //     email: 'wade.doe@example.com'
  // })
  // await userModel.deleteOne({
  //     email: 'john.doe@example.com'
  // })
      if (!redisConnection["client"].isOpen) {
      throw new Error("Redis not connected");
    }
  app.get('/uploads/*path', async (req: Request, res: Response)=>{
    let {download, fileName} = req.query
    let {path} = req.params as {path: string[]}
    if (path.length == 0) {
      throw new BadRequestExeption('file not found')
    }
    let key = path.join('/')
    let url = await s3Service.createPresignFetchUrl({Key: key})
    SuccessResponse({ res, message: "File Fetch URL", data: url })
    // let { Body, ContentType } = await s3Service.getAsset({Key: key}) 
    // s3GetPipe(Body as NodeJS.ReadableStream, res)
    // res.setHeader('Content-Type', ContentType || 'application/octet-stream')
    // res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    // if (download == 'true') {
    //   res.setHeader('Content-Disposition', `inline; filename="${fileName || key.split('/').pop()}"`)
    // }
    // return res
    // SuccessResponse({ res, message: "File Uploaded Successfully", data: key })
  })
  app.get('/presign/*path', async (req: Request, res: Response)=>{
    let {download, fileName} = req.query
    let {path} = req.params as {path: string[]}
    if (path.length == 0) {
      throw new BadRequestExeption('file not found')
    }
    let key = path.join('/')
    let { Body, ContentType } = await s3Service.getAsset({Key: key}) 
    s3GetPipe(Body as NodeJS.ReadableStream, res)
    res.setHeader('Content-Type', ContentType || 'application/octet-stream')
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    if (download == 'true') {
      res.setHeader('Content-Disposition', `inline; filename="${fileName || key.split('/').pop()}"`)
    }
    return res
    // SuccessResponse({ res, message: "File Uploaded Successfully", data: key })
  })
  app.use("/auth", authRouter)
  app.use("/users", userRouter)
  app.use(globalErrorHandler)
  app.listen(env.port, () => {
    console.log(`🚀 Server is running on http://localhost:${env.port}`);
  })
    } catch (err) {
    console.error("💥 Failed to start server:", err);
    process.exit(1);
  }
}