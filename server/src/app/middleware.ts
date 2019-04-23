import Busboy from "busboy"
import express from "express"

export async function processRequestBody(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if ((req.get("content-type") || "").startsWith("multipart/form-data")) {
    req.body = await processRequestDataWithFiles(req)
    next()
  } else {
    express.json()(req, res, next)
  }
}
function processRequestDataWithFiles(req: express.Request) {
  type IRet = {
    [key: string]: any
    $files: any[]
  }
  return new Promise<IRet>(resolve => {
    let data = { $files: [] }
    var busboy = new Busboy({ headers: req.headers })
    busboy.on("file", function(fieldName, file, filename, encoding, mime) {
      const reqFile = { name: fieldName, filename, mime, data: new Buffer("") }
      data.$files.push(reqFile)
      const chunks = [] as Buffer[]
      file.on("data", data => chunks.push(data))
      file.on("end", function() {
        reqFile.data = Buffer.concat(chunks)
        console.log("File [" + fieldName + "] Finished")
      })
    })
    busboy.on("field", function(fieldname, value) {
      data[fieldname] = parseValue(value)
    })
    busboy.on("finish", function() {
      resolve(data)
    })
    req.pipe(busboy)
  })
}

function parseValue(value) {
  return value.match(/^\d+(\.\d+)?$/)
    ? Number(value)
    : value === "true"
    ? true
    : value === "false"
    ? false
    : value === "undefined"
    ? undefined
    : value
}
