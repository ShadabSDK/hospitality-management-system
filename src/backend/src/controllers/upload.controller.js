const uploadService = require('../services/upload.service');
const { catchAsync } = require('../utils/helpers');

class UploadController {
  generatePresignedUrl = catchAsync(async (req, res) => {
    const { id: restaurantId } = req.params;
    const { fileName, fileType, fileSize } = req.body;

    const result = await uploadService.generatePresignedUrlForUpload(
      req.tenantId,
      restaurantId,
      fileName,
      fileType,
      fileSize
    );

    res.json({
      success: true,
      data: result,
    });
  });
}

module.exports = new UploadController();

