import Profile from "../../db/models/Profile.js"

const getAll = async (req, res, next) => {
  try {
    const profiles = await User.find({})
    res.send(profiles)
  } catch (error) {
    next(error)
  }
}
const getSingle = async (req, res, next) => {
  try {
    const { profileID } = req.params
    const user = await User.findById(profileID)

    res.send(user)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const newProfile = new User(req.body)
    const DbRes = await newProfile.save({ new: true })

    res.status(200).send(DbRes)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const { profileID } = req.params
    const updatedProfile = await Profile.findByIdAndUpdate(profileID, {...req.body}, {
      new: true
    })
    
    res.send(updatedProfile)
  } catch (error) {
    next(error)
  }
}

const deleteSingle = async (req, res, next) => {
  try {
    const { profileID } = req.params
    
    const DbRes = await User.destroy(profileID) 
    
    if (DbRes)
    res.status(204).send()
    
  } catch (error) {
    next(error)
  }
}



const profile = {
  create: create,
  getAll: getAll,
  getSingle: getSingle,
  update: update,
  deleteSingle: deleteSingle
}

export default profile