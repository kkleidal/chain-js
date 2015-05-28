'use-strict';

var jsonld = require("jsonld");
var urls = require(__dirname + "/../lib/urls");
var modelUtils = require(__dirname + "/../lib/model_utils");

function ld_context(req) {
    var base = urls.getBase(req);
    return {
        "name": "http://schema.org/name",
        "site": base + "/sites",
        "sensors": base + "/sensors"
    };
}

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
                jsonLD: function(req, instance, compressed, cb) {
                    instance.getSite().then(function(site) {
                        var siteLink = site ? urls.url(req, instance) : null;
                        var selfUrl = urls.url(req, instance);
                        var base = urls.getBase(req);
                        var ld_doc = {
                            "@type": "Device",
                            "@id": selfUrl,
                            "http://schema.org/name": instance.dataValues.name,
                        };
                        ld_doc[base + "/sites"] = siteLink;
                        ld_doc[base + "/sensors"] = urls.getBase(req) + "/sensors?device=" + encodeURIComponent(selfUrl);
                        if (! compressed) {
                            cb(null, ld_doc);
                            return;
                        }
                        jsonld.compact(ld_doc, ld_context(req), cb);
                    });
                },
                schema: function(edit) {
                    var schema = {
                        "title": "Device",
                        "type": "object",
                        "properties": {
                            "name": {
                                "description": "http://schema.org/name",
                                "type": "string"
                            },
                            "site": modelUtils.idSchema("the /sites to which this device belongs")
                        }
                    };
                    if (edit) {
                        schema.required = [];
                    } else {
                        schema.required = ["name", "site"];
                    }
                    return schema;
                },
                adaptInputToDB: function(validatedInput) {
                    return {
                        "name": validatedInput.name
                    };
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
