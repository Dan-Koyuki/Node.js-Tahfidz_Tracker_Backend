import Mentor from "../model/mentor.model";
import Recite from "../model/recite.model";

class MentorController {
  /**
   *
   * @param {id} default id of the user from mongoDB, from req.query
   * @param {data} data of what will be updated, from req.body
   */
  async editMentor({ id, data }) {
    try {
      if (!id) {
        throw new Error("Invalid ID!");
      }
      if (!data) {
        throw new Error("Invalid data!");
      }

      // Find the mentor by ID
      const mentor = await Mentor.findById(id);
      if (!mentor) {
        throw new Error("Mentor not found!");
      }

      // Only allow updates to valid fields
      const allowedUpdates = ["mentorName", "mentorContact", "password"];
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
        mentor[key] = validData[key];
      });

      // Save the updated mentor document
      await mentor.save();

      return {
        statusCode: 200,
        message: "Mentor profile updated successfully!",
        user: {
          id: mentor.mentorId,
          mentorName: mentor.mentorName,
          mentorContact: mentor.mentorContact,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async viewRecite({ id }) {
    try {
      const recites = await Recite.find({ reciteMentor: id });

      if (!recites.length) {
        throw new Error("No recites found for this mentor.");
      }

      return {
        statusCode: 200,
        message: "Recites found.",
        data: recites,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async reviewRecite({ id, data }) {
    try {
      if (!id) {
        throw new Error("Invalid ID!");
      }
      if (!data) {
        throw new Error("Invalid data!");
      }

      const recite = await Recite.findById(id);

      if (!recite) {
        throw new Error("Recite not found!");
      }

      // Only allow updates to valid fields
      const allowedUpdates = ["reciteScore", "reciteReview", "reciteStatus"];
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

      // Apply the updates
      Object.keys(validData).forEach((key) => {
        recite[key] = validData[key];
      });

      // Save the updated recite document
      await recite.save();

      return {
        statusCode: 200,
        message: "Recite Updated!",
        recite: recite._id,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const mentorController = new MentorController();

export default mentorController;
