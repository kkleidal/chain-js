'use-strict';

var urls = require(__dirname + "/../lib/urls");
var jsonld = require("jsonld");
var modelUtils = require(__dirname + "/../lib/model_utils");
var validate = modelUtils.validate;

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
                jsonLD: function(req, instance, compressed, cb) {
                    setImmediate(function() {
                        var ld_doc = {
                            "@type": "Site",
                            "@id": urls.url(req, instance),
                            "http://schema.org/name": instance.dataValues.name
                        };
                        if (! compressed) {
                            cb(null, ld_doc);
                            return;
                        }
                        jsonld.compact(ld_doc, ld_context, cb);
                    });
                },
                schema: function(edit) {
                    var schema = {
                        "title": "Site",
                        "type": "object",
                        "properties": {
                            "name": {
                                "description": "http://schema.org/name",
                                "type": "string"
                            }
                        }
                    };
                    if (edit) {
                        schema.required = [];
                    } else {
                        schema.required = ["name"];
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

    Site.custom = {
        resourceEnabled: true,
        resourceName: "sites",
        whereFromQuery: function(query) {}
    };

    return Site;
};
