import Profile from "../../db/models/Profile.js"

const getAll = async (req, res, next) => {
  try {
    const profiles = await Profile.find({})
    res.send(profiles)
  } catch (error) {
    next(error)
  }
}
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const profiles = await Profile.find({username})
    if(profiles.length> 0){
      const loggedProfile = profiles.find(profile => profile.password === password)
      if(loggedProfile){
        res.send(loggedProfile)
      } else{
        res.status(401).send({msg: `Password doesn't match with ${username}`})
      }
    } else{
      res.status(404).send({msg: `Username ${username} not found!`})
    }
    

  } catch (error) {
    console.log(error)
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const newProfile = new Profile(req.body)
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
    
    const DbRes = await Profile.destroy(profileID) 
    
    if (DbRes)
    res.status(204).send()
    
  } catch (error) {
    next(error)
  }
}



const profile = {
  register: register,
  getAll: getAll,
  login: login,
  update: update,
  deleteSingle: deleteSingle
}

export default profile