import { Router } from "express";
import { handleError, handleSuccess } from "../function/helper.js";
import userController from "../controller/user.controller.js";

const ActionRoute = Router();

ActionRoute.post("/register", async (req, res) => {
  try {
    const response = await userController.register(req.body);
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

export default ActionRoute;
