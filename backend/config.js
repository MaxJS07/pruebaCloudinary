import dotenv from "dotenv"

dotenv.config();

export const config = {
    db:{
        URI: process.env.DB_URI
    },
    server:{
        PORT: process.env.PORT
    },
    jwt:{
        secretKey: process.env.JWT_SECRET
    },
    email:{
        emailUser: process.env.USER_EMAIL,
        emailPass: process.env.USER_PASS
    },
    cloudinary:{
        name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
}