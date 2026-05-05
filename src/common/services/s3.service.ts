import { CompleteMultipartUploadCommandOutput, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { env } from "../../config/env.service.js"
import { MulterEnum } from "../enums/multer.enum.js"
import { createReadStream } from "fs"
import { Upload } from "@aws-sdk/lib-storage"
import { promises } from "dns"
export class S3Service{
    private client: S3Client
    constructor(){
        this.client = new S3Client({
            region: env.awsRegion,
            credentials: {
                accessKeyId: env.awsAccessKeyId,
                secretAccessKey: env.awsSecretAccessKey
            }
        })
    }
    async uploadAssets({
        storageKey = MulterEnum.diskStorage,
        Bucket = env.awsBucketName,
        path = "general",
        file,
        ACL = ObjectCannedACL.private,
        contentType
    }:{
        storageKey?: MulterEnum,
        Bucket?: string,
        path?: string,
        file: Express.Multer.File,
        ACL?: ObjectCannedACL,
        contentType?: string
        }){
            const key = `socalMedia/${path}/${Math.round(Math.random() * 1e9)}-${file.originalname}`
            const result = await this.client.send(new PutObjectCommand({
                Bucket,
                Key: key,
                ACL,
                Body: storageKey == MulterEnum.memoryStorage ? file.buffer: createReadStream(file.path),
                ContentType: contentType || file.mimetype
            }))
            return key
    }
    async uploadBigAssets({
        storageKey = MulterEnum.diskStorage,
        Bucket = env.awsBucketName,
        path = "general",
        file,
        ACL = ObjectCannedACL.private,
        contentType,
        partSize = 5 //min of chuck size is 5mb for multipart upload in s3
    }:{
        storageKey?: MulterEnum,
        Bucket?: string,
        path?: string,
        file: Express.Multer.File,
        ACL?: ObjectCannedACL,
        contentType?: string,
        partSize?: number
        }): Promise<CompleteMultipartUploadCommandOutput>{
            const key = `socalMedia/${path}/${Math.round(Math.random() * 1e9)}-${file.originalname}`
            const result = await new Upload({
                client: this.client,
                params: {
                    Bucket,
                    Key: key,
                    ACL, 
                    Body: storageKey == MulterEnum.memoryStorage ? file.buffer: createReadStream(file.path),
                    ContentType: contentType || file.mimetype
                },
                partSize: partSize * 1024 * 1024 
            })
            result.on("httpUploadProgress", (progress) => {
                console.log(`Upload progress: ${progress.loaded} / ${progress.total}`);
            })
            return await result.done()
     }
}