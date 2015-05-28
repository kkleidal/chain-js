"use-strict";

var models = require(__dirname + "/../models/index");

function url(req, dbInst) {
    var protocol = "http";
    if (req.connection.encrypted) {
        protocol = "https";
    }
    var base = protocol + "://" + req.headers.host;
    var path = dbInst.__options.classMethods.path(dbInst);
    return base + path;
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
    url: url,
    parse: parse
};
