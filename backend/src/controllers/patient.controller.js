import model from "../models/patient.model.js"

const controller = {}

controller.get = async (req, res) => {
    try {
        const data = await model.find();
        return res.status(200).json(data)
    } catch (error) {
        return res
    }
}