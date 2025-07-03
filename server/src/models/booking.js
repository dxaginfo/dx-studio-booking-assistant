const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Define associations
      Booking.belongsTo(models.User, {
        foreignKey: 'clientId',
        as: 'client'
      });
      
      Booking.belongsTo(models.User, {
        foreignKey: 'engineerId',
        as: 'engineer'
      });
      
      Booking.belongsTo(models.Studio, {
        foreignKey: 'studioId',
        as: 'studio'
      });
      
      Booking.hasMany(models.Payment, {
        foreignKey: 'bookingId',
        as: 'payments'
      });
      
      Booking.belongsToMany(models.Equipment, {
        through: 'BookingEquipment',
        foreignKey: 'bookingId',
        otherKey: 'equipmentId',
        as: 'equipment'
      });
    }
  }
  
  Booking.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    studioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Studios',
        key: 'id'
      }
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    engineerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cancelledReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true
  });
  
  return Booking;
};