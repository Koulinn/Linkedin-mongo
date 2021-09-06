import Profile from "../../db/models/Profile.js"




const getExperiences = async (req, res, next) => {
  try {
    const { _id } = req.params
    const experiences = await Profile.findById({ _id }, { experience: 1 })
    res.status(200).send(experiences.experience)
  } catch (error) {
    next(error)
  }
}


const addNewExperience = async (req, res, next) => {
  try {
    const { _id } = req.params
    console.log(req.headers)
    const getUser = await Profile.findByIdAndUpdate({ _id }, { $push: { experience: { ...req.body, user: _id } } }, { new: true })

    res.send(getUser.experience[getUser.experience.length - 1])
  } catch (error) {
    next(error)
  }
}

// without projection
const update = async (req, res, next) => {
  try {
    const { _id, _userId } = req.params
    await Profile.findOneAndUpdate({ _id: _userId, "experience._id": _id },
      {
        "experience.$": {
          ...req.body,
          _id: _id
        }
      }
    )

    const getUpdatedExperience = await Profile.findOne({ _id: _userId, "experience._id": _id }, { "experience.$": 1 })

    res.send(getUpdatedExperience.experience[0])
  } catch (error) {
    next(error)
  }
}
//with projection
const uploadImage = async (req, res, next) => {
  try {
    const { _id, _userId } = req.params
    
    const updateExperience = await Profile.findOneAndUpdate({ _id: _userId, "experience._id": _id },
      {
        $set: { "experience.$.image": req.file.path }
      },{
        projection: { "experience.$": 1 }
      }
    )

    res.send(updateExperience.experience[0])
  } catch (error) {
    next(error)
  }
}

const deleteXP = async (req, res, next) => {
  try {
    const { _id, _userId } = req.params
    
    const deleteExperience = await Profile.findByIdAndUpdate({ _id: _userId, "experience._id": _id },
      {
        $pull: {experience: {_id: _id} }
      }
    )

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}




const experience = {
  addNewExperience: addNewExperience,
  getExperiences: getExperiences,
  update: update,
  uploadImage: uploadImage,
  deleteXP: deleteXP
}

export default experience