import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken"
import model from "../models/patient.model.js"
import { config } from "../../config.js";

const controller = {};

controller.login = async (req, res) => {
    try {
        
        const {email, password} = req.body;
        const userExists = await model.findOne({email});
        if(!userExists){
            return res.status(404).json({message: "No se encontró el usuario"})
        }

        const isMatch = await bcrypt.compare(password, userExists.password)

        if(!isMatch){
            return res.status(400).json({message: "Contraseña incorrecta"})
        }

        //Inicio de sesión correcto
        userExists.loginAttempts = 0;
        userExists.timeOut = null;

        const token = jsonwebtoken.sign(
            {id: userExists._id, userType: "patient"},
            config.jwt.secretKey,
            {expiresIn: "30d"}
        )

        res.cookie("authCookie", token)
        return res.status(200).json({message: "inicio de sesión exitoso"})

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export default controller;