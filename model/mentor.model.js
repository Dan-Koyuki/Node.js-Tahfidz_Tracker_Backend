import { model, Schema } from "mongoose";

const MentorSchema = new Schema({
    mentorId: {type: String, required: true, unique: true},
    mentorName: {type: String},
    mentorContact: {type: String},
    password: {type: String, required: true},
}, {timestamps: true});

const Mentor = model("Mentor", MentorSchema);

export default Mentor;