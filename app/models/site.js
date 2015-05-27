'use-strict';

module.exports = function(sequelize, DataTypes) {
    var Site = sequelize.define("Site", {
            name: DataTypes.STRING
        }, {
            classMethods: {
                associate: function(models) {
                    Site.hasMany(models.Device);
                },
                path: function(instance) {
                    return "/" + Site.custom.resourceName + "/" + instance.dataValues.id.toString();
                }
            }
        });

    Site.custom = {
        resourceEnabled: true,
        resourceName: "sites"
    };

    return Site;
};
