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

ActionRoute.post("/login", async (req, res) => {
  try {
    const response = await userController.login(req.body);
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

ActionRoute.get("/recite/:id", async (req, res) => {
  try {
    const response = await userController.detailRecite({
      reciteId: req.params.id,
    });
    handleSuccess(res, response);
  } catch (error) {
    handleError(res, error);
  }
});

// ActionRoute.delete("/recite/:id", async (req, res) => {
//   try {
//     const response = await userController.deleteRecite({
//       reciteId: req.params.id,
//     });
//     handleSuccess(res, response);
//   } catch (error) {
//     handleError(res, error);
//   }
// });

export default ActionRoute;
