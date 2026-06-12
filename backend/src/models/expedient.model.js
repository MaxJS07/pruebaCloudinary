import moongose, {Schema, model} from "mongoose"

const expedientModel = new Schema({
    patient_id:{
        type: moongose.Schema.Types.ObjectId,
        ref: "patients"
    },
    diagnosis: {type: String},
    medications: [{medicineName: {type: String}}],
    medicalNotes: {type: String}
}, {
    timestamps: true,
    strict: false
})

export default model("expedients", expedientModel)