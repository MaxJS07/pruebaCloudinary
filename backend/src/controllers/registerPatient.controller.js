import nodemailer from "nodemailer"
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcrypt from "bcryptjs"
import {config} from "../../config.js"
import model from "../models/patient.model.js"

const controller = {};

controller.register = async (req, res) => {
    try {
        let{
            name,
            lastName,
            email,
            password,
            birthDate,
            phone,
            address,
            bloodType,
            phoneEmergencyContacts,
            isVerified,
            loginAttempts,
            timeOut
        } = req.body

        const emailExists = await model.findOne({email})
        if(emailExists){
            return res.status(400).json({message: "El correo ya está en uso"})
        }

        const passHash = await bcrypt.hash(password, 10);

        const newPatient = new model({
            name,
            lastName,
            email,
            password: passHash,
            birthDate,
            phone,
            address,
            bloodType,
            phoneEmergencyContacts,
            profilePhoto: req.file.path,
            public_id: req.file.filename,
            isVerified : isVerified || false,
            loginAttempts : loginAttempts || 0,
            timeOut: timeOut || null
        })
        await newPatient.save();

        //Verificación
        const verificationCode = crypto.randomBytes(3).toString("hex")

        const tokenCode = jsonwebtoken.sign(
            {email, verificationCode},
            config.jwt.secretKey,
            {expiresIn: "15m"}
        );
        res.cookie("verificationTokenCookie", tokenCode, {maxAge: 15 * 60 *1000});

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: config.email.emailUser,
                pass: config.email.emailPass
            }
        })

        const mailOptions = {
            from: config.email.emailUser,
            to: email,
            subject: "Verificación de correo",
            text: "Para verificar la cuenta usa este código: " + verificationCode + "."
        }

        transporter.sendMail(mailOptions, (error, info) =>{
            if(error){
                return res.status(500).json({message: error.message})
            }
            return res.status(200).json({message: "El correo de verificación fue enviado."})
        });

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

controller.verifyCode = async (req, res) => {
    try {
        const { code } = req.body;
        const token = req.cookies.verificationTokenCookie;

        const decoded = jsonwebtoken.verify(token, config.jwt.secretKey)
        const {email, verificationCode : storedCode} = decoded;

        if(code !== storedCode){
            return res.status(400).json({message: "Código incorrecto"})
        }

        const patient = await model.findOne({email});
        patient.isVerified = true;
        await patient.save();

        res.clearCookie("verificationTokenCookie");
        return res.status(200).json({message: "Email verificado"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export default controller;