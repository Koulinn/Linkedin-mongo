import express from "express"
import multer from "multer"
import profile from "./profile-handlers.js"
import lib from '../../lib/index.js'
import experience from "./profile-experience-handlers.js"
import { getPDFReadableStream } from "../../lib/pdf/profileCV.js"
import { pipeline } from "stream"
import Profile from "../../db/models/Profile.js"
import { loginValidation, signUpValidation } from "../../lib/service-validations.js"

const { validations } = lib


const router = express.Router()

router.route("/:_id/CV").get(profile.getPdf)
router.route("/").get(profile.getAll)

router
  .route("/me/:_id")
  .get(profile.getById)
  .put(profile.update)
  .post(multer({ storage: lib.cloudStorage }).single('image'), profile.uploadImage)

router
  .route("/register")
  .post(signUpValidation, profile.register)

router
  .route("/login")
  .post(loginValidation, profile.login)

router
  .route("/experience/:_id") //User ID
  .post(experience.addNewExperience)
  .get(experience.getExperiences)


router
  .route("/experience/:_userId/update/:_id") // experienceId 
  .put(experience.update)
  .delete(experience.deleteXP)

router
  .route("/experience/:_userId/update/:_id/image") // experienceId 
  .put(multer({ storage: lib.cloudStorage }).single('image'), experience.uploadImage)

router
  .route("/experience/:_id/CSV")
  .get(experience.getExpCSV)

export default router
