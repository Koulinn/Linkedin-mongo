import express from "express"
import multer from "multer"
import profile from "./profile-handlers.js"
import lib from '../../lib/index.js'
import experience from "./profile-experience-handlers.js"
import { getPDFReadableStream } from "../../lib/pdf/profileCV.js"
import { pipeline } from "stream"
import Profile from "../../db/models/Profile.js"
const { validations } = lib

const router = express.Router()


router.get("/:_id/CV", async (req, res, next) => {
  try {
    const { _id } = req.params
    const profile = await Profile.findOne({ _id })
    if (!profile) {
      return res.status(404).send()
    }

    const filename = "CV.pdf"
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
    const source = await getPDFReadableStream(profile)
    const destination = res
    pipeline(source, destination, err => {
      if (err) next(err)
    })
  } catch (error) {
    next(error)
  }
})


router.route("/").get(profile.getAll)

router
  .route("/me/:_id")
  .get(profile.getById)
  .put(profile.update)
  .post(multer({ storage: lib.cloudStorage }).single('image'), profile.uploadImage)

router
  .route("/register")
  .post(profile.register)

router
  .route("/login")
  .post(profile.login)

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


export default router
