const bcrypt = require('bcryptjs');
const { ROLES } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
  const AdminUser = sequelize.define('AdminUser', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email',
        },
        notEmpty: {
          msg: 'Email is required',
        },
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase().trim());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 255],
          msg: 'Password must be at least 8 characters',
        },
        notEmpty: {
          msg: 'Password is required',
        },
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
    role: {
      type: DataTypes.ENUM(...Object.values(ROLES)),
      defaultValue: ROLES.ADMIN,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'admin_users',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        fields: ['tenantId'],
      },
      {
        fields: ['email', 'tenantId'],
      },
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  // Instance method to compare password
  AdminUser.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Instance method to remove password from JSON
  AdminUser.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return AdminUser;
};

