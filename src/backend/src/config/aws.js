const AWS = require('aws-sdk');
const config = require('./index');

// Configure AWS
AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

// S3 Configuration
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  endpoint: config.aws.s3Endpoint,
});

// Generate presigned URL for upload
const generatePresignedUrl = (key, contentType, expiresIn = 300) => {
  const params = {
    Bucket: config.aws.s3Bucket,
    Key: key,
    ContentType: contentType,
    Expires: expiresIn, // 5 minutes default
  };

  return s3.getSignedUrlPromise('putObject', params);
};

// Generate presigned URL for download (if needed)
const generatePresignedDownloadUrl = (key, expiresIn = 3600) => {
  const params = {
    Bucket: config.aws.s3Bucket,
    Key: key,
    Expires: expiresIn, // 1 hour default
  };

  return s3.getSignedUrlPromise('getObject', params);
};

// Get public URL for an object
const getPublicUrl = (key) => {
  if (config.aws.s3Endpoint) {
    return `${config.aws.s3Endpoint}/${config.aws.s3Bucket}/${key}`;
  }
  return `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
};

// Delete object from S3
const deleteObject = async (key) => {
  const params = {
    Bucket: config.aws.s3Bucket,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    throw new Error(`Failed to delete object from S3: ${error.message}`);
  }
};

module.exports = {
  s3,
  generatePresignedUrl,
  generatePresignedDownloadUrl,
  getPublicUrl,
  deleteObject,
};

