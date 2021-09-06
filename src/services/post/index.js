import { Router } from "express";
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
    // const query = q2m(req.query);
    // console.log(query);
    // const total = await postModel.countDocuments(query.criteria); //will have to finsish the query when i get the posts
    // const posts = await postModel
    //   .find(query.criteria, query.options.fields)
    //   .sort()
    //   .skip()
    //   .limit(3);
    // res.send(posts);
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
      res.send(`blog ${req.params.Id} NOT found!!`);
    }
  } catch (error) {
    next(createHttpError(404, `post ${req.params.Id} NOT found!!`));
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
      res.send(`blog ${req.params.Id} NOT found!!`);
    }
  } catch (error) {
    next(createHttpError(404, `post ${req.params.Id} NOT found!!`));
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
