import bcrypt from "bcrypt";
import Mentor from "../model/mentor.model.js";
import Student from "../model/student.model.js";
import Recite from "../model/recite.model.js";
import CustomError from "../function/customError.js";

/**
 * @todo Implement JWT authentication for login and register endpoints.
 */
class UserController {
  async findUserByUsername(ref, username) {
    if (ref === "student") {
      return await Student.findOne({ studentId: username });
    } else if (ref === "mentor") {
      return await Mentor.findOne({ mentorId: username });
    } else {
      throw new CustomError(
        400,
        "Invalid reference type! Must be 'student' or 'mentor'."
      );
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
  async register({ username, password, ref, studentMentor }) {
    if (!ref) throw new CustomError(400, "Reference can't be empty!");

    let user;

    // Use helper function to check user existence and create a new one
    user = await this.findUserByUsername(ref, username);

    if (user)
      throw new CustomError(
        409,
        `${ref.charAt(0).toUpperCase() + ref.slice(1)} account already exists!`
      );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let mentorId;
    if (studentMentor) {
      const mentor = await Mentor.findOne({ mentorName: studentMentor }); // Use findOne to get a single mentor
      if (!mentor) {
        throw new CustomError(404, "Mentor not found!");
      }
      mentorId = mentor._id; // Assign mentor ID
    }

    // Create new user based on the ref
    user =
      ref === "student"
        ? new Student({ studentId: username, password: hashedPassword, studentMentor: mentorId })
        : new Mentor({ mentorId: username, password: hashedPassword });

    // Save user
    await user.save();

    return {
      statusCode: 200,
      data: {
        message: "Account successfully created!",
      },
    };
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
  async login({ username, password, ref }) {
    if (!ref) throw new CustomError(400, "Reference can't be empty!");

    let user;

    // Use helper function to find user
    user = await this.findUserByUsername(ref, username);

    if (!user)
      throw new CustomError(
        404,
        `${ref.charAt(0).toUpperCase() + ref.slice(1)} account not found!`
      );

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) throw new CustomError(409, "Invalid password!");

    return {
      statusCode: 200,
      data: {
        message: "Login successful!",
        user: user,
      },
    };
  }

  async deleteRecite({ reciteId }) {
    if (!reciteId)
      throw new CustomError(400, "Invalid Id, please provide a correct Id!");

    const recite = await Recite.findByIdAndDelete(reciteId);

    if (!recite) throw new CustomError(404, "Recite not found!");

    return {
      statusCode: 200,
      data: { message: "Recite successfully deleted", deletedRecite: recite },
    };
  }

  async detailRecite({ reciteId }) {
    if (!reciteId)
      throw new CustomError(400, "Invalid Id, please provide a correct Id!");

    const recite = await Recite.findById(reciteId)
      .populate("student", "studentName")
      .populate("mentor", "mentorName");

    if (!recite) throw new CustomError(404, "Recite not found!");

    return {
      statusCode: 200,
      data: { message: "Recite successfully fetched.", recite: recite },
    };
  }
}

const userController = new UserController();

export default userController;
