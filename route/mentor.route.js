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
 * @param {string} id - id of the mentor
 */
MentorRoute.get("/:id/recites", async (req, res) => {
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
 * @param {string} id - id of the mentor
 */
MentorRoute.get("/:id/students", async (req, res) => {
  try {
    const response = await mentorController.viewStudent({
      id: req.params.id, // id of the mentor from mongoDB
    });
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * Review a Recite
 * @param {string} id - id of the recite
 */
MentorRoute.post("/:id/review", async (req, res) => {
  try {
    const response = await mentorController.reviewRecite({id:req.params.id, data:req.body});
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

MentorRoute.get("/", async (req, res) => {
  try {
    const response = await mentorController.getAllMentor();
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

export default MentorRoute;
