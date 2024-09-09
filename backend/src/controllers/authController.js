import { authService } from "../services/authService.js";

export const authController = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      await authService.register(username, email, password);
      const { user, token } = await authService.login(email, password);
      res
        .status(201)
        .json({ message: "User registered successfully", user, token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res.json({ message: "Login successful", user, token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },
};
