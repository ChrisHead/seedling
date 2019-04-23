import AWS from "aws-sdk"
import fs from "fs"
import path from "path"
import request from "request"
import { Stream } from "stream"

const fileRoot = path.join(__dirname, "../files")

type IFileProvider = { store(image: string): Promise<string>; retrieve(ref: string): Stream }

export const fileProviders: Record<string, IFileProvider> = {
  local: {
    store(image) {
      const { data, filename } = getImageMetaData(image)
      const filePath = path.join(fileRoot, filename)

      return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, function(err) {
          if (err) {
            reject(err)
          } else {
            resolve(filename)
          }
        })
      })
    },
    retrieve(reference) {
      const fullpath = path.join(fileRoot, reference)
      return fs.createReadStream(fullpath)
    },
  },
  aws: {
    async store(image) {
      const accessKey = process.env.AMAZON_ACCESS_KEY
      const secretKey = process.env.AMAZON_SECRET_KEY
      const bucketName = process.env.AMAZON_BUCKET_NAME
      console.log(accessKey, secretKey, bucketName)
      if (!accessKey || !secretKey || !bucketName) {
        throw new Error("AWS not configured")
      }
      const { data, filename } = getImageMetaData(image)

      return new Promise((resolve, reject) => {
        const s3 = new AWS.S3({
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
          region: "eu-west-2",
        })

        const params: AWS.S3.PutObjectRequest = {
          Bucket: bucketName,
          Key: filename,
          Body: data,
          ACL: "public-read",
        }
        console.log("UPLOADING")
        s3.upload(params, function(err, data) {
          console.log("FINISHED", err, data)
          if (err) {
            reject(err)
          } else {
            resolve(data.Location)
          }
        })
      })
    },
    retrieve(reference) {
      return request(reference)
    },
  },
}

function getImageMetaData(image: string) {
  const match = image.match(/^data:image\/(\w+)/)
  const ext = match ? match[1] : "image"
  const filename = `file-${Math.random()}-${Date.now()}.${ext}`
  var base64Data = image.replace(/^data:image\/\w{0,4};base64,/, "")
  const data = new Buffer(base64Data, "base64")

  return { filename, data }
}
