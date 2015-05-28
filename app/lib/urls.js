"use-strict";

var models = require(__dirname + "/../models/index");

function getBase(req) {
    var protocol = "http";
    if (req.connection.encrypted) {
        protocol = "https";
    }
    return protocol + "://" + req.headers.host;
}

function url(req, dbInst) {
    var path = dbInst.__options.classMethods.path(dbInst);
    return getBase(req) + path;
}

var regIsolatePath = /^(?:[a-zA-Z]+:\/\/)?[^\/]*([^?]*)/;
function isolatePath(url) {
    var match = url.match(regIsolatePath);
    if (! match) {
        return null;
    }
    var path = match[1];
    if (path.length == 0 || path.charAt(0) !== "/") {
        path = "/" + path;
    }
    return path;
}

var regPath = /^\/([^\/]+)(\/(\d+))\/?$/;
function parse(uri) {
    var path = isolatePath(uri);
    if (! path) {
        return null;
    }
    var match = path.match(regPath);
    if (! match) {
        return null;
    }
    return {
        ModelClass: models.resourceLookup[match[1]],
        id: match[3]
    };
}

module.exports = {
    getBase: getBase,
    url: url,
    parse: parse
};
