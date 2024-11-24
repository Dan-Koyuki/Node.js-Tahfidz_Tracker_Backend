import { model, Schema } from 'mongoose'

const StudentSchema = new Schema(
  {
    studentId: { type: String, required: true, unique: true },
    studentName: { type: String },
    studentMajor: { type: String }, //Program Studi
    studentContact: { type: String },
    studentMentor: { type: Schema.Types.ObjectId, ref: 'Mentor' },
    password: { type: String, required: true }
  },
  { timestamps: true }
)

const Student = model('Student', StudentSchema)

export default Student
