import { Router } from "express";

const ActionRoute = Router();

ActionRoute.post("/register", async (req, res) => {
    try {
        const result = await userController.register(req.body);
        res.status(result.statusCode).json(result);
    } catch (error) {
        
    }
})