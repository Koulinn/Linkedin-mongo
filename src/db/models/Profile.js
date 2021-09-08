import mongoose from "mongoose";

const { Schema, model } = mongoose

const profileSchema = new Schema({
    area: { type: String, required: true },
    bio: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    surname: { type: String, required: true },
    title: { type: String, required: true },
    username: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String },
    experience: [{
        area: { type: String },
        company: { type: String },
        description: { type: String },
        image: { type: String },
        role: { type: String },
        user: { type: Schema.Types.ObjectId, ref: "Profile" },
        endDate: {type: Date},
        startDate: {type: Date},
    }]

}, {
    timestamps: true
})

export default model('Profile', profileSchema)