module.exports = (sequelize, DataTypes) => {
  const QRCode = sequelize.define('QRCode', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true, // One QR code per restaurant
      references: {
        model: 'restaurants',
        key: 'id',
      },
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tenants',
        key: 'id',
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'URL is required',
        },
      },
    },
    qrImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'qr_codes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['restaurantId'],
      },
      {
        fields: ['tenantId'],
      },
    ],
  });

  return QRCode;
};

