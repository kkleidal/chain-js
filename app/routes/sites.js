var express = require('express');
var router = express.Router();
var render = require(__dirname + '/../lib/render');
var models = require(__dirname + '/../models/index');
var urls = require(__dirname + '/../lib/urls');

function renderNotImplemented(req, res) {
    render(req, res, 500, 'error', { message: 'Not implemented', status: 500, error: new Error("Not Implemented") });
}

var ModelClass = models.Site;
var requiredFields = [];
var schema = {};
for (var fieldName in ModelClass.tableAttributes) {
    var fieldObj = ModelClass.tableAttributes[fieldName];
    if (! fieldObj._autoGenerated) {
        requiredFields.push(fieldObj.fieldName);
        schema[fieldObj.fieldName] = {
            type: fieldObj.type.toString(),
            allowNull: fieldObj.allowNull,
        };
    }
}

function containsAllRequiredFields(data) {
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (! data.hasOwnProperty(field)) {
            return false;
        }
    }
    return true;
}

router.get('/', function(req, res, next) {
    renderNotImplemented(req, res);
});

router.get('/create', function(req, res, next) {
    render(req, res, 200, "create", schema);
});

router.post('/create', function(req, res, next) {
    var data = req.body;
    if (! containsAllRequiredFields(data)) {
        render(req, res, 400, "error", {message: "Required fields not present.  See schema.", error: {status: 400}});
        return;
    }
    ModelClass.create(data).then(function(item) {
        // render(req, res, 202, "post", {
        var link = urls.url(req, item);
        render(req, res, 202, "post", {link: link});
    });
});

router.get(/^\/(\d+)\/?$/, function(req, res, next) {
    renderNotImplemented(req, res);
});

router.get(/^\/(\d+)\/edit\/?$/, function(req, res, next) {
    renderNotImplemented(req, res);
});

router.post(/^\/(\d+)\/edit\/?$/, function(req, res, next) {
    renderNotImplemented(req, res);
});

router.get(/^\/(\d+)\/delete\/?$/, function(req, res, next) {
    renderNotImplemented(req, res);
});

router.post(/^\/(\d+)\/delete\/?$/, function(req, res, next) {
    renderNotImplemented(req, res);
});

module.exports = router;
