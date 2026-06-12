import express from "express";
import controller from "../controllers/patient.controller.js"
import upload from "../../utils/cloudinaryConfig.js"
import loginController from "../controllers/patientLogin.controller.js"
import passRecoverController from "../controllers/patientPassRecover.controller.js"
import registerController from "../controllers/registerPatient.controller.js";

const router = express.Router();

router.route("/")
.get(controller.get)

router.route("/register")
.post(upload.single("profilePhoto"), registerController.register);

router.route("/verifyEmail")
.post(registerController.verifyCode);

router.route("/login")
.post(loginController.login);

router.route("/:id")
.put(upload.single("profilePhoto"), controller.update)
.delete(controller.delete)

router.route("/recoverPass/request")
.post(passRecoverController.requestCode);

router.route("/recoverPass/verifyCode")
.post(passRecoverController.verifyCode)

router.route("/recoverPass/newPass")
.post(passRecoverController.newPassword)

export default router;