import type { Request } from "express";
import multer, {diskStorage, type FileFilterCallback} from "multer";
import { v4 as uuid } from "uuid"
import { AppError } from "../utils/app.error.js";
import path from "node:path";

const storage = diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        if(file.fieldname === "productImages") {            
            cb(null, "src/uploads/product-images/")
        } else if (file.fieldname === "profileImage") {
            cb(null, "src/uploads/profile-images/")
        } else {
            cb(new AppError("Invalid field name for file upload", 400), "")
        }
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const fileName = uuid() + path.extname(file.originalname)
        cb(null, fileName)
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ["image/png", "image/jpeg","image/gif", "image/webp", "image/apng"]
    if(!allowedTypes.includes(file.mimetype)){
        return cb(new AppError("Only image files are allowed to upload", 400))
    }
    cb(null, true)
}

export const upload = multer({
    storage,
    fileFilter
})