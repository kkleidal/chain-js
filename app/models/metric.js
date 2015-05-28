'use-strict';

module.exports = function(sequelize, DataTypes) {
    var Metric = sequelize.define("Metric", {
            name: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                },
                path: function(instance) {
                }
            }
        });

    Metric.custom = {
        resourceEnabled: false,
        resourceName: null,
        whereFromQuery: function(query) {}
    };

    return Metric;
};
