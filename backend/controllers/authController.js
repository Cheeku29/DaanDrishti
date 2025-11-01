import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import NGO from "../models/NGO.js";

// POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Validate and normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check if user exists (email must be unique)
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "This email is already registered. Please use a different email.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with normalized email and handle race conditions
    let user;
    try {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: role || "donor",
      });

      console.log(`User created successfully with email: ${normalizedEmail}`);

      // If NGO, create NGO profile
      if (user.role === "ngo") {
        await NGO.create({
          userId: user._id,
          name: req.body.ngoName || name,
          registrationNumber: req.body.registrationNumber || "",
          description: req.body.description || "",
          category: req.body.category || "",
          state: req.body.state || "",
        });
      }

      // Return user data without tokens in our simplified auth
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (dbError) {
      console.error("Error creating user:", {
        code: dbError.code,
        message: dbError.message,
        email: normalizedEmail,
      });

      // Handle duplicate email error from database
      if (dbError.code === 11000 || dbError.message.includes("duplicate")) {
        // Double check if the user really exists to handle race conditions
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (!existingUser) {
          console.error(
            "Duplicate key error but user not found - retrying creation"
          );
          // If user doesn't actually exist, retry the creation
          try {
            user = await User.create({
              name,
              email: normalizedEmail,
              password: hashedPassword,
              role: role || "donor",
            });
          } catch (retryError) {
            console.error("Retry failed:", retryError);
            return res.status(400).json({
              success: false,
              message:
                "This email is already registered. Please use a different email.",
            });
          }
        } else {
          return res.status(400).json({
            success: false,
            message:
              "This email is already registered. Please use a different email.",
          });
        }
      } else {
        throw dbError;
      }
    }
  } catch (e) {
    next(e);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Just return user data, no tokens needed
    res.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
};

// POST /api/auth/refresh
// No longer needed with simplified auth
