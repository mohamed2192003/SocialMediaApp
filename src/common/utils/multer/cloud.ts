import multer from "multer"
import { tmpdir } from "os"
import { MulterEnum } from "../../enums/multer.enum.js"
export const uploadFile = ({ storageKey = MulterEnum.memoryStorage }: { storageKey?: MulterEnum }) => {
    const storage = storageKey == MulterEnum.memoryStorage ? multer.memoryStorage() :  multer.diskStorage({ 
        destination(req, file, callback) {
            callback(null, tmpdir())
        },
        filename(req, file, callback) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) + '-' + file.originalname
            callback(null, `${file.fieldname}-${uniqueSuffix}`)
        },
    })
    return multer({ storage })
}