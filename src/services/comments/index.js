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
    const comments = await commentModel.find();
    res.send(comments);
  } catch (error) {
    next(error);
  }
});
commentRouter.get("/:Id", async (req, res, next) => {
  try {
    const comment = await commentModel.findById(req.params.Id);
    if (comment) {
      res.send(comment);
    } else {
      res.status(404).send(`comment ${req.params.Id} NOT found!!`);
    }
  } catch (error) {
    next(error);
  }
});
commentRouter.put("/:Id", async (req, res, next) => {
  try {
    const comment = await commentModel.findByIdAndUpdate(
      req.params.Id,
      req.body,
      {
        new: true,
      }
    );
    if (comment) {
      res.send(comment);
    } else {
      res.send(`comment ${req.params.Id} NOT found!!`);
    }
  } catch (error) {
    next(error);
  }
});
commentRouter.delete("/:Id", async (req, res, next) => {
  try {
    const comment = await commentModel.findByIdAndDelete(req.params.Id);
    if (comment) {
      res.status(204).send(`Deleted!!`);
    } else {
      res.send(`${req.params.Id} NOT found!`);
    }
  } catch (error) {
    next(error);
  }
});

export default commentRouter;
