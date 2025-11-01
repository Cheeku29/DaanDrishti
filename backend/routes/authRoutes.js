import { Router } from "express";
import { body } from "express-validator";
import { signup, login, getMe } from "../controllers/authController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().trim().withMessage("Name is required"),
  ],
  signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/me", auth, getMe);

export default router;
