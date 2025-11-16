const QRCode = require('../models/QRCode');

class QRCodeRepository {
  async create(data) {
    return await QRCode.create(data);
  }

  async findByRestaurantId(restaurantId) {
    return await QRCode.findOne({ restaurantId });
  }

  async findByTenantIdAndRestaurantId(tenantId, restaurantId) {
    return await QRCode.findOne({ tenantId, restaurantId });
  }

  async update(restaurantId, data) {
    return await QRCode.findOneAndUpdate(
      { restaurantId },
      data,
      { new: true, runValidators: true, upsert: true }
    );
  }

  async delete(restaurantId) {
    return await QRCode.findOneAndDelete({ restaurantId });
  }
}

module.exports = new QRCodeRepository();

