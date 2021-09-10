import q2m from "query-to-mongo";
import createHttpError from "http-errors";
import postModel from "../../db/models/post.js";
import profileModel from "../../db/models/Profile.js";
import Profile from "../../db/models/Profile.js";

const postAPost = async (req, res, next) => {
  try {
    console.log(req.body);
    const post = await postModel(req.body);
    const { _id } = await post.save();
    res.status(201).send({ _id });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getPosts = async (req, res, next) => {
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
};

const getById = async (req, res, next) => {
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
};

const updatePost = async (req, res, next) => {
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
};

const deletePost = async (req, res, next) => {
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
};

const postImage = async (req, res, next) => {
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
};

const postComment = async (req, res, next) => {
  try {
    const profile = await profileModel.findById(req.body.user);
    const post = await postModel.findById(req.params.id);
    if (post) {
      const postComment = await postModel.findByIdAndUpdate(
        req.params.id,

        {
          $push: {
            comments: {
              comment: req.body.comment,
              user: req.body.user,
              name: profile.name,
              image: profile.image,
            },
          },
        },

        { new: true }
      );
      const comments = postComment.comments;
      res.send(comments[comments.length - 1]);
      // } else {
      //   next(
      //     createHttpError(404, `The Post you are looking for does NOT exist!`)
      //   );
    }
  } catch (error) {
    console.log(error);
    // next(createHttpError(404));
  }
};

const getPostComments = async (req, res, next) => {
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
};

const getCommentAndPost = async (req, res, next) => {
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
};

const updateComment = async (req, res, next) => {
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
};

const deleteComment = async (req, res, next) => {
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
};

const likePost = async (req, res, next) => {
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
};

const post = {
  postAPost: postAPost,
  getPosts: getPosts,
  getById: getById,
  updatePost: updatePost,
  deletePost: deletePost,
  postImage: postImage,
  postComment: postComment,
  getPostComments: getPostComments,
  getCommentAndPost: getCommentAndPost,
  updateComment: updateComment,
  deleteComment: deleteComment,
  likePost: likePost,
};

export default post;
