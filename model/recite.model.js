import { model, Schema } from 'mongoose'

const ReciteSchema = new Schema(
  {
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
    reciteStudent: { type: Schema.Types.ObjectId, ref: 'Student' }, // Use studentId (String) instead of ObjectId
    reciteMentor: { type: Schema.Types.ObjectId, ref: 'Mentor' } // Use mentorId (String) instead of ObjectId
  },
  { timestamps: true }
)

const Recite = model('Recite', ReciteSchema)

export default Recite
