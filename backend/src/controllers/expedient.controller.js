import model from "../models/expedient.model.js"

const controller = {}

controller.get = async (req, res) => {
    try {
        const data = await model.find().populate("patient_id", "name lastName");
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

controller.post = async (req, res) => {
    try {
        
        const {
            patient_id,
            diagnosis,
            medications,
            medicalNotes
        } = req.body;

        const newObject = new model({
            patient_id,
            diagnosis,
            medications,
            medicalNotes
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
            patient_id,
            diagnosis,
            medications,
            medicalNotes
        } = req.body

        let updatedData = {};

        if(patient_id) updatedData.patient_id = patient_id;
        if(diagnosis) updatedData.diagnosis = diagnosis;
        if(medications) updatedData.medications = medications;
        if(medicalNotes) updatedData.medicalNotes = medicalNotes;

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