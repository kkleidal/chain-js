'use-strict';

var jsonld = require("jsonld");

var ld_context = {
    "name": "http://schema.org/name",
};

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
                },
                jsonLD: function(instance, compressed, cb) {
                    setImmediate(function() {
                        var ld_doc = {
                            "http://schema.org/name": instance.dataValues.name
                        };
                        if (! compressed) {
                            cb(null, ld_doc);
                            return;
                        }
                        jsonld.compact(ld_doc, ld_context, cb);
                    });
                }
            }
        });

    Device.custom = {
        resourceEnabled: true,
        resourceName: "devices",
        whereFromQuery: function(query) {}
    };

    return Device;
};
