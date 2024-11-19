import bcrypt from 'bcrypt'
import Mentor from '../model/mentor.model'
import Student from '../model/student.model'
import Recite from '../model/recite.model'

/**
 * @todo Implement JWT authentication for login and register endpoints.
 */
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

  /**
   * 
   * @param {String} username - NIM for student or NIP for Mentor
   * @param {String} password
   * @param {String} ref - must be 'student' or 'mentor'
   * @example
   * {
   *    username: '1217050070',
   *    password: 'myPassword',
   *    ref: 'student'
   * }
   * @example
   * {
   *    username: '001278799937784',
   *    password: 'imMentor',
   *    ref: 'mentor'
   * }
   * @returns 
   */
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

  /**
   * 
   * @param {String} username - NIM for student or NIP for Mentor
   * @param {String} password
   * @param {String} ref - must be 'student' or 'mentor'
   * @example
   * {
   *    username: '1217050070',
   *    password: 'myPassword',
   *    ref: 'student'
   * }
   * @example
   * {
   *    username: '001278799937784',
   *    password: 'imMentor',
   *    ref: 'mentor'
   * }
   * @returns 
   */
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
  
  async deleteRecite({reciteId}) {
    if (!id) {
      throw new Error("Invalid Id, please provide a correct Id!");
    }

    try {
      const recite = await Recite.findByIdAndDelete(reciteId);
      
      if (!recite) {
        throw new Error("Something went wrong, Can't Delete this recite at moment! Please try again later!");
      }

      return{
        statusCode: 200,
        message: "Recite successfully deleted",
        deletedRecite: recite
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
