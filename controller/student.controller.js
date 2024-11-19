import Recite from "../model/recite.model.js";
import Student from "../model/student.model.js";

class StudentController {
  /**
   * @param {mongoose.ObjectId} id - Default Student id from mongoose (student._id);
   * @param {Object} data - data of the recite
   * @property {String} reciteSurah - Surah that was recited by student
   * @property {String} reciteAyat - Ayat of Surah that was recited by student
   * @property {String} reciteLink - Link of recording that show a student recite the Surah (GDrive or YouTube)
   * @example
   * {
   *    id: 5f8f8c44b54764421b716f57,
   *    data: {
   *      reciteSurah: "Al-Alaq",
          reciteAyat: "1-5",
          reciteLink: "https://www.youtube.com/live/VNAmTWNMJJ4?si=qm8CFvTvRtPZcuD-",
   *    }
   * }
   */
  async uploadRecite({ id, data }) {
    if (!id) {
      throw new Error("Invalid ID!");
    }

    try {
      const student = await Student.findById(id).populate("mentor");

      if (!student) {
        throw new Error("Student not found!");
      }

      if (!student.mentor) {
        throw new Error("Mentor not found for this student!");
      }

      data.reciteStudent = student.studentName;
      data.reciteMentor = student.studentMentor.mentorName;

      const reciteField = [
        "reciteSurah",
        "reciteAyat",
        "reciteLink",
        "reciteStudent",
        "reciteMentor",
      ];
      const dataKeys = Object.keys(data);

      const isValid =
        reciteField.every((key) => dataKeys.includes(key)) &&
        dataKeys.every((key) => reciteField.includes(key));
      if (!isValid) {
        throw new Error("Missing some fields! Please fill the form correctly!");
      }

      const recite = new Recite(data);

      await recite.save();

      return {
        statusCode: 200,
        message: "Recite had been uploaded.",
        recite: {
          _id: recite._id,
        },
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message,
      };
    }
  }

  /**
   *
   * @param {id} default id of the user from mongoDB, from req.query
   * @param {data} data of what will be updated, from req.body
   */
  async editStudent({ id, data }) {
    try {
      // Find the student by ID
      const student = await Student.findById(id);
      if (!student) {
        throw new Error("Student not found!");
      }

      // Only allow updates to valid fields
      const allowedUpdates = [
        "studentName",
        "studentContact",
        "password",
        "studentMajor",
      ];
      const updateKeys = Object.keys(data);

      // Validate the fields being updated
      const isValidUpdate = updateKeys.every((key) =>
        allowedUpdates.includes(key)
      );
      if (!isValidUpdate) {
        throw new Error("Invalid fields in the update request!");
      }

      // Filter out any keys where data[key] is empty, null, or undefined
      const validData = {};
      updateKeys.forEach((key) => {
        if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
          validData[key] = data[key];
        }
      });

      // If password is being updated, hash it
      if (validData.password) {
        validData.password = await bcrypt.hash(validData.password, 10);
      }

      // Apply the updates
      Object.keys(validData).forEach((key) => {
        student[key] = validData[key];
      });

      // Save the updated student document
      await student.save();

      return {
        statusCode: 200,
        message: "Student profile updated successfully!",
        user: {
          id: student.studentId, // Assuming `studentId` is the correct field
          studentName: student.studentName,
          studentContact: student.studentContact,
          studentMajor: student.studentMajor,
        },
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message,
      };
    }
  }

  async viewRecite({ id }) {
    try {
      const recites = await Recite.find({ reciteStudent: id });

      if (!recites.length) {
        throw new Error("No recites found for this student.");
      }

      return {
        statusCode: 200,
        message: "Recites found.",
        data: recites,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message,
      };
    }
  }
}

const studentController = new StudentController();

export default studentController;
