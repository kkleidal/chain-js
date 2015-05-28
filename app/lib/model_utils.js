"use-strict";

var validate = require('jsonschema').validate;
var extend = require('extend');

function idSchema(description) {
    return {
        "description": description, 
        "type": "object",
        "properties": {
            "@id": {
                "description": "URI of resource",
                "type": "string"
            }
        },
        "required": ["@id"]
    }
}

function containsAllRequiredFields(schema, data) {
    var requiredFields = schema.required || [];
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (! data.hasOwnProperty(field)) {
            return false;
        }
    }
    return true;
}

function removeUnknownProperties(data, schema) {
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (! schema.properties.hasOwnProperty(key)) {
            delete data[key];
        }
    }
    return data;
}

function myValidate(data, schema) {
    data = removeUnknownProperties(data, schema);
    if (validate(data, schema).errors.length > 0) {
        return false;
    }
    return true;
}

function create(ModelClass, req, cb) {
    var schema = ModelClass.options.classMethods.schema(false);
    var data = extend({}, req.query, req.body);
    data = removeUnknownProperties(data, schema);
    if (! myValidate(data, schema)) {
        cb(new Error("Does not match JSON schema."));
        return;
    }
    var adapted = ModelClass.options.classMethods.adaptInputToDB(data);
    ModelClass.create(adapted).then(function(item) {
        cb(null, item);
    });
}

function edit(inst, req, cb) {
    var schema = inst.__options.classMethods.schema(true);
    var data = extend({}, req.query, req.body);
    data = removeUnknownProperties(data, schema);
    if (! myValidate(data, schema)) {
        cb(new Error("Does not match JSON schema."));
        return;
    }
    var adapted = inst.__options.classMethods.adaptInputToDB(data);
    inst.updateAttributes(adapted).then(function() {
        cb(null);
    });
}

module.exports = {
    idSchema: idSchema,
    removeUnknownProperties: removeUnknownProperties,
    validate: myValidate,
    create: create,
    edit: edit
};
