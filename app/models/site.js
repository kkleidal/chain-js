'use-strict';

var jsonld = require("jsonld");

var ld_context = {
    "name": "http://schema.org/name",
};

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

    Site.custom = {
        resourceEnabled: true,
        resourceName: "sites",
        whereFromQuery: function(query) {}
    };

    return Site;
};
