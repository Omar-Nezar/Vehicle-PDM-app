import express from "express";

import { getUsers, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/getusers", getUsers);
router.delete("/deluser/:id", deleteUser);

export default router;