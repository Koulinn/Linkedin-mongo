import Profile from "../../db/models/Profile.js"



const getExperiences = async (req, res, next) => {
  try {
    const {_id} = req.params
    const experiences = await Profile.find({_id}, {experience: 1})
    res.status(200).send(experiences)
  } catch (error) {
    next(error)
  }
}


const addNewExperience = async (req, res, next) => {
  try {
    const {_id} = req.params
    const getUser = await Profile.findByIdAndUpdate({_id}, {$push: {experience: req.body}}, {new: true})

    res.send(getUser.experience[getUser.experience.length -1])
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const { _id, _userId } = req.params
    const updateExperience = await Profile.findOneAndUpdate({_id: _userId, "experience._id" : _id}, 
    {
      
      "experience.$" : {
        ...req.body,
        _id: _id
      }
    })

    const getUpdatedExperience = await Profile.findOne({_id: _userId, "experience.id": _id}, {"experience.$": 1})

    
    // delete updatedProfile._doc.password
    // delete updatedProfile._doc.experience
    // delete updatedProfile._doc.email

    res.send(getUpdatedExperience.experience[0])
  } catch (error) {
    next(error)
  }
}

const uploadImage = async (req, res, next) => {
  try {
    const { _id } = req.params
    const updatedProfile = await Profile.findByIdAndUpdate(_id, {image: req.file.path}, {
      new: true
    })
    
    delete updatedProfile._doc.password
    delete updatedProfile._doc.experience
    delete updatedProfile._doc.email
    
    res.status(200).send(updatedProfile)
    
  } catch (error) {
    next(error)
  }
}



const experience = {
  addNewExperience: addNewExperience,
  getExperiences: getExperiences,
  update: update,
  uploadImage: uploadImage
}

export default experience