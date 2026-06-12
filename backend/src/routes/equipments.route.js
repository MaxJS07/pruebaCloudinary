import express from "express";
import controller from "../controllers/equipment.controller.js"
import upload from "../../utils/cloudinaryConfig.js";

const router = express.Router();

router.route("/")
.get(controller.get)
.post(upload.single("image"), controller.post)

router.route("/:id")
.put(upload.single("image"), controller.update)
.delete(controller.delete)

export default router;