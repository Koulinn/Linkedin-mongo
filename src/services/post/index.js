import { Router } from "express";
import q2m from "query-to-mongo";
import postModel from "../../db/models/post.js";

const postRouter = Router();

postRouter.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const post = await postModel(req.body);
    const { _id } = await post.save();
    res.status(201).send({ _id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
postRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    console.log(query);
    const posts = await postModel
      .find(query.criteria, query.options.fields)
      .sort()
      .skip()
      .limit(2);
    res.send(posts);
  } catch (error) {
    next(error);
  }
});
postRouter.get("/:Id", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.Id);
    if (post) {
      res.send(post);
    } else {
      res.send(`post ${req.params.Id} NOT found!!`);
    }
  } catch (error) {
    next(error);
  }
});
postRouter.put("/:Id", async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndUpdate(req.params.Id, req.body, {
      new: true,
    });
    if (post) {
      res.send(post);
    } else {
      res.send(`post ${req.params.Id} NOT found!!`);
    }
  } catch (error) {
    next();
  }
});
postRouter.delete("/:Id", async (req, res, next) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.Id);
    if (post) {
      res.status(204).send(`Deleted!!`);
    } else {
      res.send(`${req.params.Id} NOT found!`);
    }
  } catch (error) {
    next(error);
  }
});

export default postRouter;
