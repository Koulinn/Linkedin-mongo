import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "Profile" },
    image: { type: String, required: false },
    likes: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
      },
    ],
    comments: [
      {
        comment: { type: String },
        user: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
        // name: { type: String },
        // image: { type: String },
        createdAt: { type: Date, required: true, default: Date.now },
        updatedAt: { type: Date, required: true, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default model("Post", postSchema);

// name: {type: String},
// surname: {type: String},
// email: {type: String},
// bio: {type: String},
// title: {type: String},
// area: {type: String},
// image: {type: String},
// username: {type: String},

//{
//     "_id": "5d93ac84b86e220017e76ae1", //server generated
//     "text": "this is a text 12312 1 3 1",  <<--- THIS IS THE ONLY ONE YOU'LL BE SENDING!!!
//     "username": "admin",
//     "user": {
//         "_id": "5d84937322b7b54d848eb41b", //server generated
//         "name": "Diego",
//         "surname": "Banovaz",
//         "email": "diego@strive.school",
//         "bio": "SW ENG",
//         "title": "COO @ Strive School",
//         "area": "Berlin",
//         "image": ..., //server generated on upload, set a default here
//         "username": "admin",
//         "createdAt": "2019-09-20T08:53:07.094Z", //server generated
//         "updatedAt": "2019-09-20T09:00:46.977Z", //server generated
//     }
//     "createdAt": "2019-10-01T19:44:04.496Z", //server generated
//     "updatedAt": "2019-10-01T19:44:04.496Z", //server generated
//     "image": ... //server generated on upload, set a default here
// }
