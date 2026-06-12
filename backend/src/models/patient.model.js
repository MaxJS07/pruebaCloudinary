import {Schema, model} from "mongoose"

const patientModel = new Schema({
    name: {type: String},
    lasName: {type: String},
    email: {type: String},
    password: {type: String},
    birthDate: {type: Date},
    phone: {type: String},
    address: {type: String},
    bloodType: {type: String},
    phoneEmergencyContacts: [
        {
            phone: {type: String},
            name: {type: String}
        }
    ],
    profilePhoto: {type: String},
    public_id: {type: String},
    isVerified: {type: Boolean},
    loginAttempts: {type: Number},
    timeOut: {type: Date}
}, {
    timestamps: true,
    strict:false
})

export default model("patients", patientModel);