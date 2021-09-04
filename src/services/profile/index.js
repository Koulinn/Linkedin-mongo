import express from "express"
import profile from "./profile-handlers.js"

const router = express.Router()

router
  .route("/")
  .get(profile.getAll)
  .post(profile.create)
  

router
  .route("/:profileID")
  .get(profile.getSingle)
  .put(profile.update)
  .delete(profile.deleteSingle)


export default router
