import Recite from '../model/recite.model'
import Student from '../model/student.model'

class StudentController {
  /**
   * @param {id} default Student id from mongoose (student._id);
   * @param {data} data of the recite
   */
  async uploadRecite ({ id, data }) {
    if (!id) {
      throw new Error('Invalid ID!')
    }

    try {
      const student = await Student.findById(id).populate('mentor')

      if (!student) {
        throw new Error('Student not found!')
      }

      if (!student.mentor) {
        throw new Error('Mentor not found for this student!');
      }

      data.reciteStudent = student.studentName
      data.reciteMentor = student.studentMentor.mentorName

      const reciteField = [
        'reciteSurah',
        'reciteAyat',
        'reciteLink',
        'reciteStudent',
        'reciteMentor'
      ]
      const dataKeys = Object.keys(data)

      const isValid = dataKeys.every(key => reciteField.includes(key))
      if (!isValid) {
        throw new Error('Missing some fields! Please fill the form correctly!')
      }

      const recite = new Recite(data)

      await recite.save()

      return {
        statusCode: 200,
        message: 'Recite had been uploaded.',
        recite: {
          _id: recite._id
        }
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message
      }
    }
  }
}
