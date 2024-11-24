import CustomError from '../function/customError.js'
import Recite from '../model/recite.model.js'
import Student from '../model/student.model.js'

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
  async uploadRecite ({ id, data }) {
    if (!id) throw new CustomError(400, 'Invalid ID!')

    const student = await Student.findById(id).populate({
      path: 'studentMentor', // Field to populate
      select: 'mentorName mentorId' // Specify fields to retrieve from the Mentor model
    })

    console.log(student.studentMentor);

    if (!student) throw new CustomError(404, 'Student not found!')

    if (!student.studentMentor)
      throw new CustomError(404, 'Mentor not found for this student!')

    data.reciteStudent = student._id
    data.reciteMentor = student.studentMentor._id

    const reciteField = [
      'reciteSurah',
      'reciteAyat',
      'reciteLink',
      'reciteStudent',
      'reciteMentor'
    ]
    const dataKeys = Object.keys(data)
    const invalidKeys = dataKeys.filter(key => !reciteField.includes(key))
    if (invalidKeys.length > 0) {
      throw new CustomError(
        400,
        `Invalid fields detected: ${invalidKeys.join(', ')}`
      )
    }

    const recite = new Recite(data)

    await recite.save()

    return {
      statusCode: 200,
      data: { message: 'Recite had been uploaded.', recite: recite }
    }
  }

  /**
   *
   * @param {id} default id of the user from mongoDB, from req.query
   * @param {data} data of what will be updated, from req.body
   */
  async editStudent ({ id, data }) {
    if (!id) throw new CustomError(400, 'Invalid ID!')
    if (!data) throw new CustomError(400, "Data can't be empty!")

    // Find the student by ID
    const student = await Student.findById(id)
    if (!student) {
      throw new CustomError(404, 'Student not found!')
    }

    // Only allow updates to valid fields
    const allowedUpdates = [
      'studentName',
      'studentContact',
      'password',
      'studentMajor'
    ]
    const updateKeys = Object.keys(data)

    // Check if all update fields are valid
    const invalidKeys = updateKeys.filter(key => !allowedUpdates.includes(key))
    if (invalidKeys.length > 0) {
      throw new CustomError(
        400,
        `Invalid fields detected: ${invalidKeys.join(', ')}`
      )
    }

    // Filter out any keys where data[key] is empty, null, or undefined
    const validData = {}
    updateKeys.forEach(key => {
      if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
        validData[key] = data[key]
      }
    })

    // If password is being updated, hash it
    if (validData.password) {
      validData.password = await bcrypt.hash(validData.password, 10)
    }

    // Apply the updates
    Object.assign(student, validData)

    // Save the updated student document
    await student.save()

    return {
      statusCode: 200,
      data: {
        message: 'Student profile updated successfully!',
        student: student
      }
    }
  }

  async viewRecite ({ id }) {
    if (!id) throw new CustomError(400, "ID can't be empty!")
    const student = await Student.findById(id)

    if (!student) throw new CustomError(404, 'Student not found!')

    const recites = await Recite.find({ reciteStudent: student.studentId })

    if (!recites.length)
      throw new CustomError(404, 'No recites found for this student.')

    return {
      statusCode: 200,
      data: {
        message: 'Recites found.',
        recites: recites
      }
    }
  }

  async getAllStudent () {
    const students = await Student.find().populate({
      path: 'studentMentor', // Field to populate
      select: 'mentorName mentorId' // Specify fields to retrieve from the Mentor model
    })
    if (!students.length) throw new CustomError(404, 'No students found.')

    return {
      statusCode: 200,
      data: {
        message: 'Students found.',
        students: students
      }
    }
  }
}

const studentController = new StudentController()

export default studentController
