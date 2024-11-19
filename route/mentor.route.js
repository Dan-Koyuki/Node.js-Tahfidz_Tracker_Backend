import { Router } from "express";
import mentorController from "../controller/mentor.controller.js";
import { handleError, handleSuccess } from "../function/helper.js";

const MentorRoute = Router();

/**
 * Edit Mentor Profile
 */
MentorRoute.put("/:id", async (req, res) => {
  try {
    const response = await mentorController.editMentor({
      id: req.params.id, // id of the mentor from mongoDB
      data: req.body,
    });
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * List of Recites that was handled by a Mentor
 */
MentorRoute.get("/:id", async (req, res) => {
  try {
    const response = await mentorController.viewRecite({
      id: req.params.id, // id of the mentor from mongoDB
    });
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * Review a Recite
 */
MentorRoute.post("/review", async (req, res) => {
  try {
    const response = await mentorController.reviewRecite(req.body);
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

export default MentorRoute;
