"use-strict";

function url(req, dbInst) {
    var protocol = "http";
    if (req.connection.encrypted) {
        protocol = "https";
    }
    var base = protocol + "://" + req.headers.host;
    var path = dbInst.__options.classMethods.path(dbInst);
    return base + path;
}

module.exports = {
    url: url
};
