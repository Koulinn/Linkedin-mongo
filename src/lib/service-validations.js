const headerTypeJson = (req, res, next) =>{
    try {
        console.log(req.headers)
        if(req.headers['content-type'] === 'application/json' ){
            next()
        } else {
            res.status(400).send({msg: "Content-Type: application/json is missing."})
        }
    } catch (error) {
        next()
    }
}

// 'content-type': 'multipart/form-data

const headerFormData = (req, res, next) =>{
    try {
        console.log(req.headers)
        if(req.headers['content-type'].includes('multipart/form-data')){
            next()
        } else {
            res.status(400).send({msg: "To upload an image you need to send it as FormData"})
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