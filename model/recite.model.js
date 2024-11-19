import { model, Schema } from 'mongoose'

const ReciteSchema = new Schema(
  {
    reciteID: { type: String, required: true, unique: true },
    reciteSurah: { type: String, required: true },
    reciteAyat: { type: String, required: true },
    reciteLink: { type: String, required: true },
    reciteScore: { type: Number, default: 0 },
    reciteReview: {type: String, default: ""},
    reciteStatus: {
      type: String,
      enum: ['PENDING', 'REVIEWED'],
      default: 'PENDING'
    },
    reciteStudent: { type: String, required: true }, // Use studentId (String) instead of ObjectId
    reciteMentor: { type: String, required: true } // Use mentorId (String) instead of ObjectId
  },
  { timestamps: true }
)

// Optional: You can define virtual fields to populate actual Student and Mentor objects if necessary
ReciteSchema.virtual('student', {
  ref: 'Student',
  localField: 'reciteStudent', // Field in the Recite model that references the Student
  foreignField: 'studentId' // Field in the Student model that should match
})

ReciteSchema.virtual('mentor', {
  ref: 'Mentor',
  localField: 'reciteMentor', // Field in the Recite model that references the Mentor
  foreignField: 'mentorId' // Field in the Mentor model that should match
})

// Ensure virtual fields are included when converting to JSON or objects
ReciteSchema.set('toObject', { virtuals: true })
ReciteSchema.set('toJSON', { virtuals: true })

const Recite = model('Recite', ReciteSchema)

export default Recite
