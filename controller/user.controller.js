import bcrypt from 'bcrypt'
import Mentor from '../model/mentor.model'
import Student from '../model/student.model'

class UserController {
  async findUserByUsername (ref, username) {
    if (ref === 'student') {
      return await Student.findOne({ studentId: username })
    } else if (ref === 'mentor') {
      return await Mentor.findOne({ mentorId: username })
    } else {
      throw new Error("Invalid reference type! Must be 'student' or 'mentor'.")
    }
  }

  async register ({ username, password, ref }) {
    if (!ref) {
      throw new Error("Reference can't be empty!")
    }

    let user

    try {
      // Check if `ref` is valid
      if (ref !== 'student' && ref !== 'mentor') {
        throw new Error(
          "Invalid reference type! Must be 'student' or 'mentor'."
        )
      }

      // Use helper function to check user existence and create a new one
      user = await this.findUserByUsername(ref, username)

      if (user) {
        throw new Error(
          `${
            ref.charAt(0).toUpperCase() + ref.slice(1)
          } account already exists!`
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create new user based on the ref
      user =
        ref === 'student'
          ? new Student({ studentId: username, password: hashedPassword })
          : new Mentor({ mentorId: username, password: hashedPassword })

      // Save user
      await user.save()

      return {
        statusCode: 200,
        message: 'Account successfully created!'
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message
      }
    }
  }

  async login ({ username, password, ref }) {
    if (!ref) {
      throw new Error("Reference can't be empty!")
    }

    let user

    try {
      // Use helper function to find user
      user = await this.findUserByUsername(ref, username)

      if (!user) {
        throw new Error(
          `${ref.charAt(0).toUpperCase() + ref.slice(1)} account not found!`
        )
      }

      // Check password
      const isPasswordMatch = await bcrypt.compare(password, user.password)

      if (!isPasswordMatch) {
        throw new Error('Invalid password!')
      }

      return {
        statusCode: 200,
        message: 'Login successful!',
        user: {
          id: user._id,
          username: ref === 'student' ? user.studentId : user.mentorId,
          type: ref
        }
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message
      }
    }
  }

  /**
   *
   * @param {id} default id of the user from mongoDB, from req.query
   * @param {data} data of what will be updated, from req.body
   */
  async editMentor ({ id, data }) {
    if (!id) {
      throw new Error('Invalid ID!')
    }

    try {
      // Find the mentor by ID
      const mentor = await Mentor.findById(id)
      if (!mentor) {
        throw new Error('Mentor not found!')
      }

      // Only allow updates to valid fields
      const allowedUpdates = ['mentorName', 'mentorContact', 'password']
      const updateKeys = Object.keys(data)

      // Validate the fields being updated
      const isValidUpdate = updateKeys.every(key =>
        allowedUpdates.includes(key)
      )
      if (!isValidUpdate) {
        throw new Error('Invalid fields in the update request!')
      }

      // If password is being updated, hash it
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10)
      }

      // Apply the updates
      updateKeys.forEach(key => {
        mentor[key] = data[key]
      })

      // Save the updated mentor document
      await mentor.save()

      return {
        statusCode: 200,
        message: 'Mentor profile updated successfully!',
        user: {
          id: mentor.mentorId,
          mentorName: mentor.mentorName,
          mentorContact: mentor.mentorContact
        }
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message
      }
    }
  }

  /**
   *
   * @param {id} default id of the user from mongoDB, from req.query
   * @param {data} data of what will be updated, from req.body
   */
  async editStudent ({ id, data }) {
    

    try {
      // Find the student by ID
      const student = await Student.findById(id)
      if (!student) {
        throw new Error('Student not found!')
      }

      // Only allow updates to valid fields
      const allowedUpdates = ['studentName', 'studentContact', 'password', 'studentMajor']
      const updateKeys = Object.keys(data)

      // Validate the fields being updated
      const isValidUpdate = updateKeys.every(key =>
        allowedUpdates.includes(key)
      )
      if (!isValidUpdate) {
        throw new Error('Invalid fields in the update request!')
      }

      // If password is being updated, hash it
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10)
      }

      // Apply the updates
      updateKeys.forEach(key => {
        student[key] = data[key]
      })

      // Save the updated student document
      await student.save()

      return {
        statusCode: 200,
        message: 'Student profile updated successfully!',
        user: {
          id: student.mentorId,
          studentName: student.studentName,
          studentContact: student.studentContact,
          studentMajor: student.studentMajor
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

const userController = new UserController()

export default userController
