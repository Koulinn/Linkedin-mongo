import express from "express"
import profile from "./profile-handlers.js"

const router = express.Router()

router
  .route("/")
  .get(profile.getAll)

router
  .route("/register")
  .post(profile.register)

router
  .route("/login")
  .post(profile.login)


router
  .route("/:profileID")
  .put(profile.update)
  .delete(profile.deleteSingle)


export default router
