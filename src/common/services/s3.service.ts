import { CompleteMultipartUploadCommandOutput, DeleteObjectCommand, GetObjectCommand, GetObjectCommandOutput, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { env } from "../../config/env.service.js"
import { MulterEnum } from "../enums/multer.enum.js"
import { createReadStream } from "fs"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
export class S3Service {
    private client: S3Client
    constructor() {
        this.client = new S3Client({
            region: env.awsRegion,
            credentials: {
                accessKeyId: env.awsAccessKeyId,
                secretAccessKey: env.awsSecretAccessKey
            }
        })
    }
    async createPresignUrl({
        Bucket = env.awsBucketName,
        path = "general",
        originalname,
        contentType
    }: {
        Bucket?: string,
        path?: string,
        contentType?: string,
        originalname?: string,
    }): Promise<{ url: string, key: string }> {
        const key = `socalMedia/${path}/${Math.round(Math.random() * 1e9)}-${originalname}`
        const result = new PutObjectCommand({
            Bucket,
            Key: key,
            ContentType: contentType
        })
        const url = await getSignedUrl(this.client as any, result, { expiresIn: 60 * 2 })
        return { url, key }
    }
    async uploadAsset({
        storageKey = MulterEnum.diskStorage,
        Bucket = env.awsBucketName,
        path = "general",
        file,
        ACL = ObjectCannedACL.private,
        contentType
    }: {
        storageKey?: MulterEnum,
        Bucket?: string,
        path?: string,
        file: Express.Multer.File,
        ACL?: ObjectCannedACL,
        contentType: string
    }) {
        const key = `socalMedia/${path}/${Math.round(Math.random() * 1e9)}-${file.originalname}`
        const result = await this.client.send(new PutObjectCommand({
            Bucket,
            Key: key,
            ACL,
            Body: storageKey == MulterEnum.memoryStorage ? file.buffer : createReadStream(file.path),
            ContentType: contentType || file.mimetype
        }))
        return key
    }
    async uploadAssets({
        storageKey = MulterEnum.diskStorage,
        Bucket = env.awsBucketName,
        path = "general",
        files,
        ACL = ObjectCannedACL.private,
        contentType,
        originalName
    }: {
        storageKey?: MulterEnum,
        Bucket?: string,
        path?: string,
        files: Express.Multer.File[],
        ACL?: ObjectCannedACL,
        contentType?: string,
        originalName?: string
    }): Promise<{ key: string, result: string[] }> {
        const key = `socalMedia/${path}/${Math.round(Math.random() * 1e9)}-${originalName}`
        const result = await Promise.all(files.map(item => {
            return this.uploadAsset({
                storageKey,
                Bucket,
                path,
                file: item,
                ACL,
                contentType: item.mimetype
            })
        }))
        return { key, result }
    }
    async uploadBigAssets({
        storageKey = MulterEnum.diskStorage,
        Bucket = env.awsBucketName,
        path = "general",
        file,
        ACL = ObjectCannedACL.private,
        contentType,
        partSize = 5 //min of chuck size is 5mb for multipart upload in s3
    }: {
        storageKey?: MulterEnum,
        Bucket?: string,
        path?: string,
        file: Express.Multer.File,
        ACL?: ObjectCannedACL,
        contentType?: string,
        partSize?: number
    }): Promise<CompleteMultipartUploadCommandOutput> {
        const key = `socalMedia/${path}/${Math.round(Math.random() * 1e9)}-${file.originalname}`
        const result = await new Upload({
            client: this.client,
            params: {
                Bucket,
                Key: key,
                ACL,
                Body: storageKey == MulterEnum.memoryStorage ? file.buffer : createReadStream(file.path),
                ContentType: contentType || file.mimetype
            },
            partSize: partSize * 1024 * 1024
        })
        result.on("httpUploadProgress", (progress) => {
            console.log(`Upload progress: ${progress.loaded} / ${progress.total}`);
        })
        return await result.done()
    }
    async getAsset({
        Bucket = env.awsBucketName,
        Key
    }: {
        Bucket?: string,
        Key: string,
    }): Promise<GetObjectCommandOutput> {
        const result = await new GetObjectCommand({
            Bucket,
            Key
        })
        return this.client.send(result)
    }
    async deleteAsset({
        Bucket = env.awsBucketName,
        Key
    }: {
        Bucket?: string,
        Key: string,
    }) {
        const result = await new DeleteObjectCommand({
            Bucket,
            Key
        })
        return this.client.send(result)
    }
    async createPresignFetchUrl({
        Bucket = env.awsBucketName,
        Key,
        fileName,
        download
    }: {
        Bucket?: string,
        Key: string,
        fileName?: string,
        download?: string
    }): Promise<string> {
        const result = new GetObjectCommand({
            Bucket,
            Key,
            ResponseContentDisposition: download === 'true' ? `attachment; filename="${fileName || Key.split('/').pop()}"` : undefined
        })
        const url = await getSignedUrl(this.client as any, result, { expiresIn: 60 * 2 })
            return url
    }
}
export const s3Service = new S3Service()