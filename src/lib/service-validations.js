import { body } from 'express-validator'

export const signUpValidation = [
    body("title").exists().withMessage("Title is mandatory").notEmpty().withMessage('Must not be empty'),
    body("name").exists().withMessage("Name is mandatory").notEmpty().withMessage('Must not be empty'),
    body("surname").exists().withMessage("Surname is mandatory").notEmpty().withMessage('Must not be empty'),
    body("email").exists().withMessage("Email is mandatory").notEmpty().withMessage('Must not be empty'),
    body("password").exists().withMessage("Password is mandatory").notEmpty().withMessage('Must not be empty'),
    body("bio").exists().withMessage("Bio is mandatory").notEmpty().withMessage('Must not be empty'),
    body("area").exists().withMessage("Area is mandatory").notEmpty().withMessage('Must not be empty'),
    body("username").exists().withMessage("Username is mandatory").notEmpty().withMessage('Needed to login'),
]

export const loginValidation = [
    body("username").exists().withMessage("Username is mandatory").notEmpty().withMessage('Must not be empty'),
    body("password").exists().withMessage("Password is mandatory").notEmpty().withMessage('Must not be empty')
]



const headerTypeJson = (req, res, next) => {
    try {
        console.log(req.headers)
        if (req.headers['content-type'] === 'application/json') {
            next()
        } else {
            res.status(400).send({ msg: "Content-Type: application/json is missing." })
        }
    } catch (error) {
        next()
    }
}

// 'content-type': 'multipart/form-data

const headerFormData = (req, res, next) => {
    try {
        console.log(req.headers)
        if (req.headers['content-type'].includes('multipart/form-data')) {
            next()
        } else {
            res.status(400).send({ msg: "To upload an image you need to send it as FormData" })
        }
    } catch (error) {
        next()
    }
}

const validations = {
    headerTypeJson: headerTypeJson,
    headerFormData: headerFormData
}

export default validations