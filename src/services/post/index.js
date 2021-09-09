import { Router } from "express";
import multer from "multer";
import cloudStorage from "../../lib/cloud-storage.js";
import post from "./post-handlers.js";

const postRouter = Router();

postRouter.route("/")
  .post(post.postAPost)
  .get(post.getPosts)

postRouter.route("/:Id")
  .get(post.getById)
  .put(post.updatePost)
  .delete(post.deletePost)
  .post(multer({ storage: cloudStorage }).single("image"), post.postImage)


postRouter.route("/post/:id").post(post.postComment)
postRouter.route("/post/:id/comments").get(post.getPostComments)
postRouter.route("/post/:id/comments/:commentId").get(post.getCommentAndPost)
postRouter.route("/post/:id/comments/:commentId").put(post.updateComment)
postRouter.route("/post/:id/comments/:commentId").delete(post.deleteComment)



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
