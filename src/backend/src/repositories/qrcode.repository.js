const initModels = require('../models');

class QRCodeRepository {
  constructor() {
    this.models = null;
  }

  getModels() {
    if (!this.models) {
      this.models = initModels();
    }
    return this.models;
  }

  async create(data) {
    const { QRCode } = this.getModels();
    return await QRCode.create(data);
  }

  async findByRestaurantId(restaurantId) {
    const { QRCode } = this.getModels();
    return await QRCode.findOne({ where: { restaurantId } });
  }

  async findByTenantIdAndRestaurantId(tenantId, restaurantId) {
    const { QRCode } = this.getModels();
    return await QRCode.findOne({ where: { tenantId, restaurantId } });
  }

  async update(restaurantId, data) {
    const { QRCode } = this.getModels();
    const [qrCode, created] = await QRCode.upsert({
      ...data,
      restaurantId
    }, {
      returning: true
    });
    return qrCode;
  }

  async delete(restaurantId) {
    const { QRCode } = this.getModels();
    return await QRCode.destroy({ where: { restaurantId } });
  }
}

module.exports = new QRCodeRepository();

