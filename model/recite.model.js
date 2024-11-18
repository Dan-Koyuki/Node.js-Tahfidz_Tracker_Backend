import { model, Schema } from "mongoose";

const ReciteSchema = new Schema({
    reciteID: { type: String, required: true, unique: true },
    reciteSurah: { type: String, required: true },
    reciteAyat: { type: String, required: true },
    reciteLink: { type: String, required: true },
    reciteScore: { type: Number, default: 0 },
    reciteStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'REVIEWED'], default: 'PENDING' },
    reciteStudent: {type: Schema.Types.ObjectId, ref: 'Student'},
    reciteMentor: {type: Schema.Types.ObjectId, ref: 'Mentor'},
  }, {timestamps: true});

  const Recite = model("Recite", ReciteSchema);

  export default Recite;