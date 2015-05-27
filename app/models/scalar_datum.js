'use-strict';

module.exports = function(sequelize, DataTypes) {
    var ScalarDatum = sequelize.define("ScalarDatum", {
            timestamp: DataTypes.DATE,
            value: DataTypes.FLOAT,
            units: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    ScalarDatum.belongsTo(models.Sensor);
                },
                path: function(instance) {
                    return "/" + ScalarDatum.custom.resourceName + "/" + instance.dataValues.id.toString();
                }
            }
        });

    ScalarDatum.custom = {
        resourceEnabled: true,
        resourceName: "scalar-data"
    };

    return ScalarDatum;
};
