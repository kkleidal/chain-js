var express = require('express');
var router = express.Router();
var render = require(__dirname + '/../lib/render');
var models = require(__dirname + '/../models/index');
var urls = require(__dirname + '/../lib/urls');
var async = require('async');
var extend = require('extend');
var ldUtils = require(__dirname + '/../lib/ld_utils');
var modelUtils = require(__dirname + '/../lib/model_utils');

function renderNotImplemented(req, res) {
    render(req, res, 500, 'error', { message: 'Not implemented', status: 500, error: new Error("Not Implemented") });
}

var ModelClass = models.Site;

router.get('/', function(req, res, next) {
    var whereClause = ModelClass.custom.whereFromQuery(req.query) || {};
    var limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    var offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    ModelClass.findAll({order: 'id DESC', where: whereClause, limit: limit, offset: offset}).then(function(result) {
        var context = {};
        async.map(result, function(inst, cb) {
            ModelClass.options.classMethods.jsonLD(req, inst, true, function(err, jsonLD) {
                if (err) {
                    cb(err);
                    return;
                }
                extend(context, jsonLD["@context"]);
                delete jsonLD["@context"];
                cb(null, jsonLD);
            });
        }, function(err, mapped) {
            if (err) {
                render(req, res, 500, "error", {message: "Error when resolving results.", error: err});
                return;
            }
            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            context["numberOfItems"] = "https://schema.org/numberOfItems"; 
            var combined = {
                "@context": context,
                "@id": fullUrl,
                "asOf": ldUtils.asOf(),
                "numberOfItems": mapped.length,
                "results": {
                    "@list": mapped
                }  
            };
            render(req, res, 200, "list", combined);
        });
    });
});

router.get('/create', function(req, res, next) {
    render(req, res, 200, "create", ModelClass.options.classMethods.schema(false));
});

router.post('/create', function(req, res, next) {
    modelUtils.create(ModelClass, req, function(err, item) {
        if (err) {
            render(req, res, 400, "error", {message: "Bad request.", status: 400, error: err});
            return;
        }
        var link = urls.url(req, item);
        render(req, res, 202, "post", {link: link});
    });
});

function getFromId(id, cb) {
    ModelClass.findOne({where: {id: id}}).then(function(result) {
        if (! result) {
            cb(new Error("Not found."));
            return;
        }
        cb(null, result);
    });
}

router.get(/^\/(\d+)\/?$/, function(req, res, next) {
    getFromId(req.params[0], function(err, result) {
        if (err) {
            render(req, res, 404, "error", {message: "Resource not found.", status: 404, error:err});
            return;
        }
        ModelClass.options.classMethods.jsonLD(req, result, true, function(err, jsonLD) {
            if (err) {
                render(req, res, 500, "error", {message: "Error when resolving result.", error: err});
                return;
            }
            render(req, res, 200, "single", jsonLD);
        });
    });
});

router.get(/^\/(\d+)\/edit\/?$/, function(req, res, next) {
    getFromId(req.params[0], function(err, result) {
        if (err) {
            render(req, res, 404, "error", {message: "Resource not found.", status: 404, error:err});
            return;
        }
        ModelClass.options.classMethods.jsonLD(req, result, true, function(err, jsonLD) {
            if (err) {
                render(req, res, 500, "error", {message: "Error when resolving result.", error: err});
                return
            }
            var schema = ModelClass.options.classMethods.schema(true);
            render(req, res, 200, "edit", {schema: schema, data: jsonLD});
        });
    });
});

router.post(/^\/(\d+)\/edit\/?$/, function(req, res, next) {
    getFromId(req.params[0], function(err, result) {
        if (err) {
            render(req, res, 404, "error", {message: "Resource not found.", status: 404, error:err});
            return;
        }
        modelUtils.edit(result, req, function(err, link) {
            if (err) {
                render(req, res, 400, "error", {message: "Bad request.", status: 400, error:err});
                return;
            }
            render(req, res, 202, "post", {link: link});
        }); 
    });
});

router.get(/^\/(\d+)\/delete\/?$/, function(req, res, next) {
    getFromId(req.params[0], function(err, result) {
        if (err) {
            render(req, res, 404, "error", {message: "Resource not found.", status: 404, error:err});
            return;
        }
        ModelClass.options.classMethods.jsonLD(req, result, true, function(err, jsonLD) {
            if (err) {
                render(req, res, 500, "error", {message: "Error when resolving result.", error: err});
                return
            }
            render(req, res, 200, "delete", jsonLD);
        });
    });
});

router.post(/^\/(\d+)\/delete\/?$/, function(req, res, next) {
    getFromId(req.params[0], function(err, result) {
        if (err) {
            render(req, res, 404, "error", {message: "Resource not found.", status: 404, error:err});
            return;
        }
        result.destroy().then(function() {
            render(req, res, 204, "post", {});
        });
    });
});

module.exports = router;
