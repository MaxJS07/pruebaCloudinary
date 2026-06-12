import model from "../models/equipment.model.js"
import { v2 as cloudinary } from "cloudinary";

const controller = {}

controller.get = async (req, res) => {
    try {
        const data = await model.find();
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

controller.post = async (req, res) => {
    try {

        const {
            equipmentName,
            description,
            brand,
            modelName,
            purchaseDate,
            maintenanceDate,
            condition,
            status,
            isAvailable
        } = req.body;

        const newObject = new model({
            equipmentName,
            description,
            brand,
            modelName,
            purchaseDate,
            maintenanceDate,
            condition,
            image: req.file.path,
            public_id: req.file.filename,
            status,
            isAvailable
        })

        await newObject.save();
        return res.status(200).json({ message: "Se guardó el registro correctamente", data: newObject })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

controller.delete = async (req, res) => {
    try {
        const objectFound = await model.findById(req.params.id)
        if (!objectFound) {
            return res.status(404).json({ message: "No se encontró el registro que se quería eliminar" })
        }
        await cloudinary.uploader.destroy(objectFound.public_id);
        await model.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "Se eliminó el registro." })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

controller.update = async (req, res) => {
    try {
        const objectToUpdate = await model.findById(req.params.id);
        if (!objectToUpdate) {
            return res.status(404).json({ message: "El registro que se quiere actualizar no existe." })
        }

        const {
            equipmentName,
            description,
            brand,
            modelName,
            purchaseDate,
            maintenanceDate,
            condition,
            status,
            isAvailable
        } = req.body

        let updatedData = {};

        if (equipmentName) updatedData.equipmentName = equipmentName;
        if (description) updatedData.description = description;
        if (brand) updatedData.brand = brand;
        if (modelName) updatedData.modelName = modelName;
        if (purchaseDate) updatedData.purchaseDate = purchaseDate;
        if (maintenanceDate) updatedData.maintenanceDate = maintenanceDate;
        if (condition) updatedData.condition = condition;

        if (typeof status === "boolean"){
            updatedData.status = status;
        } else if(status === "true"){
            updatedData.status = true
        } else if(status === "false"){
            updatedData.status = false;
        } 

        if (typeof isAvailable === "boolean"){
            updatedData.isAvailable = isAvailable;
        } else if(isAvailable === "true"){
            updatedData.isAvailable = true
        } else if(isAvailable === "false"){
            updatedData.isAvailable = false;
        } 

        if (req.file) {
            await cloudinary.uploader.destroy(objectToUpdate.public_id)
            updatedData.image = req.file.path
            updatedData.public_id = req.file.filename
        }

        const updatedObject = await model.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        )
        return res.status(200).json({ message: "Se actualizó el registro.", data: updatedObject })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export default controller;