import model from "../models/patient.model.js"
import {v2 as cloudinary} from "cloudinary";
import bcrypt from "bcryptjs"

const controller = {}

controller.get = async (req, res) => {
    try {
        const data = await model.find();
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

controller.delete = async (req, res) => {
    try {
        const objectFound = await model.findById(req.params.id)
        if(!objectFound){
            return res.status(404).json({message: "No se encontró el registro que se quería eliminar"})
        }
        await cloudinary.uploader.destroy(objectFound.public_id);
        await model.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "Se eliminó el registro."})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

controller.update = async (req, res) =>{
    try {
        const objectToUpdate = await model.findById(req.params.id);
        if(!objectToUpdate){
            return res.status(404).json({message: "El registro que se quiere actualizar no existe."})
        }

        const {
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

        let updatedData = {};

        if(name) updatedData.name = name
        if(lastName) updatedData.lastName = lastName
        if(email) updatedData.email = email
        if(password) updatedData.password = await bcrypt.hash(password, 10);
        if(birthDate) updatedData.birthDate = birthDate
        if(phone) updatedData.phone = phone
        if (address) updatedData.address = address
        if(bloodType) updatedData.bloodType = bloodType
        if(phoneEmergencyContacts) updatedData.phoneEmergencyContacts = phoneEmergencyContacts
        if(isVerified) updatedData.isVerified = isVerified
        if(loginAttempts) updatedData.loginAttempts = loginAttempts
        if(timeOut) updatedData.timeOut = timeOut;
        if(req.file){
            await cloudinary.uploader.destroy(objectToUpdate.public_id)
            updatedData.profilePhoto = req.file.path
            updatedData.public_id = req.file.filename
        }

        const updatedObject = await model.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {new:true}
        )
        return res.status(200).json({message: "Se actualizó el registro.", data: updatedObject})

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}