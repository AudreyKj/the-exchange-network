const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
  secrets = process.env;
} else {
  secrets = require("./secrets");
}

const s3 = new aws.S3({
  accessKeyId: secrets.AWS_KEY,
  secretAccessKey: secrets.AWS_SECRET
});

exports.upload = (req, res, next) => {
  if (!req.file) {
    return res.sendStatus(500);
  }

  const { filename, mimetype, size, path } = req.file;

  const promise = s3
    .putObject({
      Bucket: "retina-imageboard",
      ACL: "public-read",
      Key: req.session.userId + "/" + filename,
      Body: fs.createReadStream(path),
      ContentType: mimetype,
      ContentLength: size
    })
    .promise();

  promise
    .then(() => {
      next();
      fs.unlink(path, () => {});
    })
    .catch(err => {
      res.sendStatus(500);
    });
};

exports.delete = async function deleteImg(dir) {
  const listParams = { Bucket: "retina-imageboard", Prefix: dir };
  const listedObjects = await s3.listObjectsV2(listParams).promise();
  if (listedObjects.Contents.length === 0) return;
  const deleteParams = {
    Bucket: "retina-imageboard",
    Delete: { Objects: [] }
  };
  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(dir);
};
