import Profile from "../../db/models/Profile.js"
import bcrypt from 'bcrypt'
import { validationResult } from "express-validator";
import { getPDFReadableStream } from "../../lib/pdf/profileCV.js"
import { pipeline } from "stream"


const getPdf = async (req, res, next) => {
  try {
    console.log('Someone requested a PDF download')
    const { _id } = req.params
    const profile = await Profile.findOne({ _id })
    if (!profile) {
      return res.status(404).send()
    }

    const filename =  _id + "CV.pdf"
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
    const source = await getPDFReadableStream(profile)
    const destination = res
    pipeline(source, destination, err => {
      if (err) next(err)
    })
  } catch (error) {
    next(error)
  }
}



const getAll = async (req, res, next) => {
  try {
    const allProfiles = await Profile.find()
    res.send(allProfiles)
  } catch (error) {
    next(error)
  }
}


const getById = async (req, res, next) => {
  try {
    const { _id } = req.params
    const profile = await Profile.find({ _id }, { password: 0, /* experience: 0 */ })
    res.send(profile[0])
  } catch (error) {
    next(error)
  }
}
const login = async (req, res, next) => {
  try {
    const errorList = validationResult(req)
    if (!errorList.isEmpty()) {
      return res.status(400).send({ msg: errorList })
    }
    const { username, password } = req.body
    const profiles = await Profile.findOne({ username }, { experience: 0, email: 0 })
    if (profiles) {
      const unhashedPassword = await bcrypt.compare(password, profiles.password)
      delete profiles._doc.password

      if (unhashedPassword) {
        console.log('Someone has logged')
        res.send(profiles)
      } else {
        res.status(401).send({ msg: `Password doesn't match with ${username}` })
      }
    } else {
      res.status(404).send({ msg: `Username ${username} not found!` })
    }


  } catch (error) {
    console.log(error)
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const errorList = validationResult(req)
    if (!errorList.isEmpty()) {
      return res.status(400).send({ msg: errorList })
      // next({msg: errorList})
    }
    const { username, password } = req.body
    const usernameAlreadyExists = await Profile.find({ username })
    if (usernameAlreadyExists.length > 0) {
      res.status(400).send({ msg: `Username ${username} already in use please choose another one.` })
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      const newProfile = new Profile({ ...req.body, password: hashedPassword })
      await newProfile.save()

      const filteredProfile = await Profile.findOne({ username }, { experience: 0, email: 0 })
      const unhashedPassword = await bcrypt.compare(password, filteredProfile.password)
      delete filteredProfile._doc.password

      if (unhashedPassword) {
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
    // if (!errorList.isEmpty()) {
    //   return res.status(400).send({ msg: errorList })
    // }
    const { _id } = req.params
    const updatedProfile = await Profile.findByIdAndUpdate(_id, { ...req.body }, {
      new: true
    })

    delete updatedProfile._doc.password
    delete updatedProfile._doc.experience
    delete updatedProfile._doc.email

    res.send(updatedProfile)
  } catch (error) {
    next(error)
  }
}

const uploadImage = async (req, res, next) => {
  try {
    const { _id } = req.params
    const updatedProfile = await Profile.findByIdAndUpdate(_id, { image: req.file.path }, {
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







const profile = {
  getPdf: getPdf,
  getAll: getAll,
  register: register,
  getById: getById,
  login: login,
  update: update,
  uploadImage: uploadImage
}

export default profile