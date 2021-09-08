// GET https://yourapi.herokuapp.com/api/profile/{userId}/CV

// Generates and download a PDF with the CV of the user(details, picture, experiences)

import PdfPrinter from "pdfmake"
import axios from "axios"

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
}

const getFileExtension = (imageUrl) => {

  const urlParts = imageUrl.split("/");
  const fileName = urlParts[urlParts.length - 1];

  const [id, extension] = fileName.split(".");

  return extension;
}





export const getPDFReadableStream = async (profile) => {
  const printer = new PdfPrinter(fonts)
  let imagePart = {}
  console.log(profile.image)
  if (profile.image) {
    const response = await axios.get(profile.image, { responseType: "arraybuffer" });
    const extension = getFileExtension(profile.image)

    const base64 = response.data.toString("base64")
    const base64Image = `data:image/${extension};base64,${base64}`;
    imagePart = { image: base64Image, width: 150, margin: [0, 0, 0, 20] }

  }





  const docDefinition = {
    content: [
      imagePart,
      {
        text: profile.name + " " + profile.surname + "\n \n" + "Summary \n" + profile.bio + "\n \n"
      },

      {
        columns: [
          {

            width: 170,
            text: "\n Contact \n \n" +
              "Email:" + profile.email

          },
          {
            text: '\n Experience \n \n' + "  " + profile.experience.map(exp => {
              return (
                "Working as " + exp.role + " at " + exp.company + " in " + exp.area + "\n \n"
                + " Job Description : " + exp.description
                + "\n \n \n \n"
              )


            })
          }
        ]
      }
    ]
  }

  const options = {}
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)

  pdfReadableStream.end()
  return pdfReadableStream
}
