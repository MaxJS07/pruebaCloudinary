import express from "express"
import controller from "../controllers/specialty.controller.js"

const router = express.Router();

router.route("/")
.get(controller.get)
.post(controller.post)

router.route("/:id")
.put(controller.update)
.delete(controller.delete)

export default router;