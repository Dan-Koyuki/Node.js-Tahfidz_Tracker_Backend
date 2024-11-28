import bcrypt from "bcrypt";
import CustomError from "../function/customError.js";
import Mentor from "../model/mentor.model.js";
import Recite from "../model/recite.model.js";
import Student from "../model/student.model.js";

class MentorController {
  /**
   *
   * @param {id} default id of the user from mongoDB, from req.query
   * @param {data} data of what will be updated, from req.body
   */
  async editMentor({ id, data }) {
    // Validate input
    if (!id) throw new CustomError(400, "ID can't be empty!");
    if (!data) throw new CustomError(400, "Data can't be empty!");

    // Find the mentor by ID
    const mentor = await Mentor.findById(id);
    if (!mentor) throw new CustomError(404, "Mentor not found!");

    // Define allowed fields for updates
    const allowedUpdates = ["mentorName", "mentorContact", "password"];
    const updateKeys = Object.keys(data);

    // Check if all update fields are valid
    const invalidKeys = updateKeys.filter(
      (key) => !allowedUpdates.includes(key)
    );
    if (invalidKeys.length > 0) {
      throw new CustomError(
        400,
        `Invalid fields detected: ${invalidKeys.join(", ")}`
      );
    }

    // Filter out empty, null, or undefined fields
    const validData = {};
    for (const key of updateKeys) {
      if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
        validData[key] = data[key];
      }
    }

    // Hash password if being updated
    if (validData.password) {
      validData.password = await bcrypt.hash(validData.password, 10);
    }

    // Apply the updates
    Object.assign(mentor, validData);

    // Save the updated mentor document
    await mentor.save();

    return {
      statusCode: 200,
      data: {
        message: "Mentor profile updated successfully!",
        mentor: mentor,
      },
    };
  }

  async viewRecite({ id }) {
    if (!id) throw new CustomError(400, "ID can't be empty!");

    const recites = await Recite.find({ reciteMentor: id});

    if (!recites.length)
      throw new CustomError(404, "No recites found for this mentor.");

    return {
      statusCode: 200,
      data: {
        message: "Recites found.",
        recites: recites,
      },
    };
  }

  async reviewRecite({ id, data }) {
    if (!id) throw new CustomError(400, "ID can't be empty!");
    if (!data) throw new CustomError(400, "Data can't be empty!");

    const recite = await Recite.findById(id);

    if (!recite) throw new CustomError(404, "Recite not found!");

    // Only allow updates to valid fields
    const allowedUpdates = ["reciteScore", "reciteReview", "reciteStatus"];
    const updateKeys = Object.keys(data);

    // Check if all update fields are valid
    const invalidKeys = updateKeys.filter(
      (key) => !allowedUpdates.includes(key)
    );
    if (invalidKeys.length > 0) {
      throw new CustomError(
        400,
        `Invalid fields detected: ${invalidKeys.join(", ")}`
      );
    }

    // Filter out any keys where data[key] is empty, null, or undefined
    const validData = {};
    updateKeys.forEach((key) => {
      if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
        validData[key] = data[key];
      }
    });

    // Apply the updates
    Object.assign(recite, validData);

    // Save the updated recite document
    await recite.save();

    return {
      statusCode: 200,
      data: {
        message: "Recite Updated!",
        recite: recite,
      },
    };
  }

  async viewStudent({id}) {
    if (!id) throw new CustomError(400, "ID can't be empty!");
    const students = await Student.find({ studentMentor: id });
    if (!students.length) throw new CustomError(404, "No students found!");
    return {
      statusCode: 200,
      data: {
        message: "Students found!",
        students: students,
      },
    };
  }

  async getAllMentor() {
    const mentors = await Mentor.find();
    if (!mentors.length) throw new CustomError(404, "No mentors found!");
    return {
      statusCode: 200,
      data: {
        message: "Mentors found!",
        mentors: mentors,
      },
    };
  }
}

const mentorController = new MentorController();

export default mentorController;
