import model from "../models/specialty.model.js"

const controller = {}

controller.get = async (req, res) => {
    try {
        const data = await model.find();
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

controller.post = async (req, res) => {
    try {
        
        const {
            specialtyName,
            description,
            isAvailable
        } = req.body;

        const newObject = new model({
            specialtyName,
            description,
            isAvailable
        })

        await newObject.save();
        return res.status(200).json({message: "Se guardó el registro correctamente", data: newObject})

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
            specialtyName,
            description,
            isAvailable
        } = req.body

        let updatedData = {};

        if(specialtyName) updatedData.specialtyName = specialtyName;
        if(description) updatedData.description = description;
        if(typeof isAvailable === "boolean") updatedData.isAvailable = isAvailable;

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

export default controller;