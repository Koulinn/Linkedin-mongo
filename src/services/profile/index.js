import express from "express"
import multer from "multer"
import profile from "./profile-handlers.js"
import lib from '../../lib/index.js'

const router = express.Router()

router
  .route("/:_id")
  .get(profile.getById)
  .put(profile.update)
  .post(multer({ storage: lib.cloudStorage }).single('image'), profile.uploadImage)

router
  .route("/register")
  .post(profile.register)

router
  .route("/login")
  .post(profile.login)


export default router
