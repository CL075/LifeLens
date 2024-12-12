const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.uploadToS3 = async (fileName, fileContent) => {
  const params = {
    Bucket: '你的S3桶名稱',
    Key: fileName,
    Body: fileContent,
    ContentType: 'image/jpeg'
  };
  const data = await s3.upload(params).promise();
  return data.Location;
};
