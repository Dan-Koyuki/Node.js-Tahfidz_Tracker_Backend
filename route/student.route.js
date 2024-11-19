import { Router } from "express";
import studentController from "../controller/student.controller.js";
import { handleError, handleSuccess } from "../function/helper.js";

const StudentRoute = Router();

StudentRoute.put("/:id", async (req, res) => {
  try {
    const response = await studentController.editStudent({
      id: req.params.id, // id of the student from mongoDB
      data: req.body,
    });
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

StudentRoute.post("/uploadRecite", async (req, res) => {
  try {
    const response = await studentController.uploadRecite(req.body);
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

StudentRoute.get("/:id/recite", async (req, res) => {
  try {
    const response = await studentController.viewRecite({
      id: req.params.id, // id of the student from mongoDB
    });
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

StudentRoute.get("/", async (req, res) => {
  try {
    const response = await studentController.getAllStudent();
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});


export default StudentRoute;
