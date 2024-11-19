import Mentor from '../model/mentor.model'
import Recite from '../model/recite.model'

class MentorController {
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

  async viewRecite ({ id }) {
    try {
      const recites = await Recite.find({ reciteMentor: id })

      if (!recites.length) {
        throw new Error('No recites found for this mentor.')
      }

      return {
        statusCode: 200,
        message: 'Recites found.',
        data: recites
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message
      }
    }
  }

  async reviewRecite ({ id, data }) {
    try {
      if (!id) {
        throw new Error('Invalid ID!')
      }
      const recite = await Recite.findById(id)

      const allowedUpdates = ['reciteScore', 'reciteReview', 'reciteStatus']
      const updateKeys = Object.keys(data)

      const isValidUpdate = updateKeys.every(key =>
        allowedUpdates.includes(key)
      )
      if (!isValidUpdate) {
        throw new Error('Invalid fields in the update request!')
      }

      // Apply the updates
      updateKeys.forEach(key => {
        recite[key] = data[key]
      })

      await recite.save();

      return{
        statusCode: 200,
        message: "Recite Updated!",
        recite: recite._id
      }

    } catch (error) {
      return {
        statusCode: 400,
        message: error.message
      }
    }
  }
}

const mentorController = new MentorController()

export default mentorController
