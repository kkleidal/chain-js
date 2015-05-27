'use-strict';

module.exports = function(sequelize, DataTypes) {
    var Sensor = sequelize.define("Sensor", {
            name: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Sensor.belongsTo(models.Device);
                    Sensor.hasOne(models.Metric);
                    Sensor.hasMany(models.ScalarDatum);
                },
                path: function(instance) {
                    return "/" + Sensor.custom.resourceName + "/" + instance.dataValues.id.toString();
                }
            }
        });

    Sensor.custom = {
        resourceEnabled: true,
        resourceName: "sensors"
    };

    return Sensor;
};
