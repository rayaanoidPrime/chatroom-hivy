import { userService } from "../services/userService.js";

export const userController = {
  async getAllUsers(req, res) {
    try {
      const allUsers = await userService.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async getCurrentUser(req, res) {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      console.log("eeeeeeeeeeeeeeee");
      res.status(401).json({ message: error.message });
    }
  },
};
