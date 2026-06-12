import jsonwebtoken from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import nodemailer from "nodemailer"
import { config } from "../../config.js"
import model from "../models/patient.model.js"

const controller = {};

controller.requestCode = async(req, res) =>{
    try {
        const {email} = req.body;
        const patientFound = await model.findOne({email})
        if(!patientFound){
            return res.status(404).json({message: "No se encontró el paciente"})
        }

        const randomCode = crypto.randomBytes(3).toString("hex");

        const token = jsonwebtoken.sign(
            {email, randomCode, verified: false},
            config.jwt.secretKey,
            {expiresIn: "15m"}
        )
        res.cookie("recoveryCookie", token, {maxAge: 15 * 60 * 1000})

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.emailUser,
                pass: config.email.emailPass
            }
        })

        const mailOptions = {
            from: config.email.emailUser,
            to: email,
            subject: "Recuperar contraseña",
            text: "Parar recuperar tu contraseña usa este código: " + randomCode
        }

        transporter.sendMail(mailOptions, (error, info) =>{
            if(error){
                return res.status(500).json({message: error.message})
            }
            return res.status(200).json({message: "Se envió el email de recuperación."})
        })

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

controller.verifyCode = async (req, res) => {
    try {
        const { code } = req.body;

        const token = req.cookies.recoveryCookie;
        const decoded = jsonwebtoken.verify(token, config.jwt.secretKey)

        if(code !== decoded.randomCode){
            return res.status(400).json({message: "Código incorrecto"})
        }

        const newToken = jsonwebtoken.sign(
            {email: decoded.email, verified: true},
            config.jwt.secretKey,
            {expiresIn: "15m"}
        )

        res.cookie("recoveryCookie", newToken, {maxAge: 15 * 60 *1000});
        return res.status(200).json({message: "Código verificado, puede cambiar su contraseña."})


    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

controller.newPassword = async (req, res) => {
    try {
        
        const {
            newPass,
            confirmPass
        } = req.body

        if(newPass !== confirmPass){
            return res.status(400).json({message: "La confirmación de contraseña no coincide."})
        }

        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token, config.jwt.secretKey);
        if(!decoded.verified){
            return res.status(403).json({message: "Cambio de contraseña no autorizado."})
        }

        const passHash = await bcrypt.hash(newPass, 10);

        await model.findOneAndUpdate(
            {email: decoded.email},
            {password: passHash},
            {new: true}
        )
        res.clearCookie("recoveryCookie");
        return res.status(200).json({message: "Cambio de contraseña exitoso"})

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export default controller;