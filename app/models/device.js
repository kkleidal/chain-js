'use-strict';

module.exports = function(sequelize, DataTypes) {
    var Device = sequelize.define("Device", {
            name: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Device.belongsTo(models.Site);
                    Device.hasMany(models.Sensor);
                },
                path: function(instance) {
                    return "/" + Device.custom.resourceName + "/" + instance.dataValues.id.toString();
                }
            }
        });

    Device.custom = {
        resourceEnabled: true,
        resourceName: "devices"
    };

    return Device;
};
