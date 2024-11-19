import mongoose, { model, Schema } from 'mongoose'

const StudentSchema = new Schema(
  {
    studentId: { type: String, required: true, unique: true },
    studentName: { type: String },
    studentMajor: { type: String }, //Program Studi
    studentContact: { type: String },
    studentMentor: { type: String },
    password: { type: String, required: true }
  },
  { timestamps: true }
)

StudentSchema.virtual('mentor', {
  ref: 'Mentor',
  localField: 'studentMentor', // Field in the Student model that references the Mentor
  foreignField: 'mentorId' // Field in the Mentor model that should match
})

StudentSchema.set('toObject', { virtuals: true })
StudentSchema.set('toJSON', { virtuals: true })

const Student = model('Student', StudentSchema)

export default Student
