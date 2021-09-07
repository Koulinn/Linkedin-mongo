import { Router } from "express";
import commentModel from "../../db/models/comments.js";

const commentRouter = Router();

commentRouter.post("/", async (req, res, next) => {
  try {
    const comment = await commentModel(req.body).save();
    res.status(201).send(comment._id);
  } catch (error) {
    next(error);
  }
});
commentRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
commentRouter.get("/:Id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
commentRouter.put("/:Id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
commentRouter.delete("/:Id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default commentRouter;
