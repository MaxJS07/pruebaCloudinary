import mongoose, {Schema, model} from "mongoose";

const equipmentModel = new Schema({
    equipmentName: {type: String},
    description: {type: String},
    brand: {type: String},
    model: {type: String},
    purchaseDate: {type: Date},
    maintenanceDate: {type: Date},
    condition: {type: String},
    image: {type: String},
    public_id: {type: String},
    status: {type: Boolean},
    isAvailable: {type: Boolean}
}, {
    timestamps: true,
    strict: false
})

export default model("equipments", equipmentModel);