import Profile from "../../db/models/Profile.js"
import json2csv from "json2csv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs-extra"
import { pipeline } from "stream"

const { createReadStream } = fs
const experienceJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../../data/experiences.json")

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


const getExpCSV = async (req, res, next) => {
  try {
    const { _id } = req.params
    const profile = await Profile.findById({ _id })    
    console.log(experienceJSONPath)
    
    const filename = "test.csv"
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`) // this header tells the browser to open the "save file as" dialog
    const source = createReadStream(experienceJSONPath)
    const transform = new json2csv.Transform({ fields: ["area", "company", "description", 
    "image", "role", "user", "endDate", "startDate"] })
    const destination = res

    pipeline(source, transform, destination, err => {
      if (err) next(err)
    })

    // res.status(200).send()

  } catch (error) {
    next(error)
  }
}

const experience = {
  addNewExperience: addNewExperience,
  getExperiences: getExperiences,
  update: update,
  uploadImage: uploadImage,
  deleteXP: deleteXP,
  getExpCSV: getExpCSV
}

export default experience