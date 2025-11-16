const { generatePresignedUrl, getPublicUrl } = require('../config/aws');
const { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } = require('../utils/constants');
const { ValidationError } = require('../utils/errors');
const { generateRandomString } = require('../utils/helpers');
const config = require('../config');

class UploadService {
  async generatePresignedUrlForUpload(tenantId, restaurantId, fileName, fileType, fileSize) {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
      throw new ValidationError(`File type ${fileType} not allowed. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
    }

    // Validate file size
    if (fileSize > MAX_FILE_SIZE) {
      throw new ValidationError(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Generate unique file key
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${generateRandomString()}.${fileExtension}`;
    const key = `${tenantId}/${restaurantId}/${uniqueFileName}`;

    // Generate presigned URL
    const presignedUrl = await generatePresignedUrl(key, fileType, 300); // 5 minutes expiry
    const fileUrl = getPublicUrl(key);

    return {
      presignedUrl,
      fileUrl,
      key,
      expiresIn: 300,
    };
  }
}

module.exports = new UploadService();

