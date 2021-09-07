import { Router } from "express";
import multer from "multer";
import q2m from "query-to-mongo";
import postModel from "../../db/models/post.js";
import cloudStorage from "../../lib/cloud-storage.js";

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
    console.log("the query ==>", query);
    const posts = await postModel
      .find(query.criteria, query.options.fields)
      .sort()
      .skip()
      .limit(10);
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
      res.status(404).send(`post ${req.params.Id} NOT found!!`);
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

postRouter.post(
  "/:Id",
  multer({ storage: cloudStorage }).single("image"),
  async (req, res, next) => {
    try {
      const addImage = await postModel.findByIdAndUpdate(
        req.params.Id,
        { image: req.file.path },
        { new: true }
      );
      if (addImage) {
        res.status(200).send(addImage);
      } else {
        res.status(404).send(`${req.params.Id} NOT found!!`);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default postRouter;

// postRouter.post("/:Id", multer({storage: cloudStorage}).single("image"), async (req, res, next) => {
//     try {
//   const { _id } = req.params
//   const addImg = await postModel.findByIdAndUpdate(_id, {image: req.file.path}, {
//     new: true
//   })
//   const addImg = await postModel.findByIdAndUpdate(req.params.)

//   res.status(200).send(addImg)

// } catch (error) {
//   next(error)
// }
