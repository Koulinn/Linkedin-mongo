import express from "express"
import profile from "./profile-handlers.js"

const router = express.Router()

router
  .route("/:_id")
  .get(profile.getById)
  .put(profile.update)

router
  .route("/register")
  .post(profile.register)

router
  .route("/login")
  .post(profile.login)


router
  .route("/:profileID")
  .delete(profile.deleteSingle)


export default router
