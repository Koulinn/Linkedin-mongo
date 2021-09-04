import Profile from "../../db/models/Profile.js"
import bcrypt from 'bcrypt'

const getById = async (req, res, next) => {
  try {
    const {_id} = req.params
    const profiles = await Profile.find({_id}, {password: 0, experience: 0})
    res.send(profiles)
  } catch (error) {
    next(error)
  }
}
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const profiles = await Profile.findOne({username}, {experience: 0})
    if(profiles){
      const unhashedPassword = await bcrypt.compare(password, profiles.password)
      delete profiles._doc.password

      if(unhashedPassword){
        res.send(profiles)
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
    const { username, password } = req.body
    const usernameAlreadyExists = await Profile.find({username})
    if(usernameAlreadyExists.length > 0 ){
      res.status(400).send({msg: `Username ${username} already in use please choose another one.`})
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      const newProfile = new Profile({...req.body, password: hashedPassword})
      await newProfile.save()

      const filteredProfile = await Profile.findOne({username},{experience: 0})
      const unhashedPassword = await bcrypt.compare(password, filteredProfile.password)
      delete filteredProfile._doc.password

      if(unhashedPassword){
        res.status(201).send(filteredProfile)
        return
      }
      
    }
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
  getById: getById,
  login: login,
  update: update,
  deleteSingle: deleteSingle
}

export default profile