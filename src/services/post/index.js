import e, { Router } from "express";
import multer from "multer";
import q2m from "query-to-mongo";
import createHttpError from "http-errors";
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
    // console.log("the query ==>", query);
    const posts = await postModel
      // .find({ text: "Additional" })
      .find(query.criteria, query.options.fields)
      .populate("user")
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

postRouter.post("/post/:id", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post) {
      const postComment = await postModel.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: req.body } },
        { new: true }
      );
      res.send(postComment);
    } else {
      next(
        createHttpError(404, `The Post you are looking for does NOT exist!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(createHttpError(404));
  }
});
postRouter.get("/post/:id/comments", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post) {
      const allComments = post.comments;
      res.send(allComments);
    } else {
      next(
        createHttpError(404, `The Post you are looking for does NOT exist!`)
      );
    }
  } catch (error) {
    next(createHttpError(404));
  }
});
postRouter.get("/post/:id/comments/:commentId", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post) {
      const comment = post.comments.find(
        (com) => com._id.toString() === req.params.commentId
      );
      if (comment) {
        res.send(comment);
      } else {
        next(
          createHttpError(
            404,
            `The comment you are looking for does NOT exist!`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `The Post you are looking for does NOT exist!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(createHttpError(404));
  }
});
postRouter.put("/post/:id/comments/:commentId", async (req, res, next) => {
  try {
    console.log("yes");
    const comment = await postModel.findOneAndUpdate(
      // { _id: req.params.id, "comments.$._id": req.params.commentId },
      { _id: req.params.id, "comments._id": req.params.commentId },

      {
        $set: {
          // "comments.$.comment": req.body,
          "comments.$": req.body,
        },
      },
      { new: true, runValidators: true }
    );

    if (comment) {
      res.send(comment);
    } else {
      next(
        createHttpError(404, `The Post you are looking for does NOT exist!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(createHttpError(404));
  }
});
postRouter.delete("/post/:id/comments/:commentId", async (req, res, next) => {
  try {
    const comment = await postModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: { _id: req.params.commentId },
        },
      },
      { new: true }
    );
    res.send(comment);
  } catch (error) {
    next(createHttpError(404));
  }
});
//Likes
postRouter.post("/:postId/like", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.postId);
    if (post) {
      const postLike = post.likes.find(
        (like) => like.userId == req.body.userId
      );
      if (!postLike) {
        const like = await postModel.findByIdAndUpdate(
          req.params.postId,
          { $push: { likes: req.body } },
          { new: true }
        );
        res.send(like);
      } else {
        const like = await postModel.findByIdAndUpdate(
          req.params.postId,
          { $pull: { likes: req.body } },
          { new: true }
        );
        res.send(like);
      }
    } else {
      next(createHttpError(404, `post${req.params.postId} Not found!`));
    }
  } catch (error) {
    next(error);
  }
});

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
