import multer from "multer";
import {v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from "multer-storage-cloudinary"
import { config } from "../config.js";

cloudinary.config({
    cloud_name: config.cloudinary.name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "prueba2",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "svg"]
    }
})

const upload = multer({storage})

export default upload;