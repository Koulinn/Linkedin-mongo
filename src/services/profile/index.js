import express from "express"
import multer from "multer"
import profile from "./profile-handlers.js"
import lib from '../../lib/index.js'
import experience from "./profile-experience-handlers.js"


const {validations} = lib

const router = express.Router()

router
  .route("/me/:_id")
  .get(profile.getById)
  .put(validations.headerTypeJson, profile.update)
  .post(validations.headerFormData, multer({ storage: lib.cloudStorage }).single('image'), profile.uploadImage)

router
  .route("/register")
  .post(validations.headerTypeJson, profile.register)

router
  .route("/login")
  .post(validations.headerTypeJson, profile.login)

router
  .route("/experience/:_id") //User ID
  .post(validations.headerTypeJson, experience.addNewExperience)
  .get(experience.getExperiences)

  
router
  .route("/experience/:_userId/update/:_id") // experienceId 
  .put(validations.headerTypeJson, experience.update)
  .delete(experience.deleteXP)

  router
  .route("/experience/:_userId/update/:_id/image") // experienceId 
  .put(validations.headerFormData, multer({ storage: lib.cloudStorage }).single('image'), experience.uploadImage)


export default router
