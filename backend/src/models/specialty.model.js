import {Schema, model} from "mongoose"

const specialtyModel = new Schema({
    specialtyName: {type: String},
    description: {type: String},
    isAvailable: {type: Boolean}
})

export default model("specialties", specialtyModel)