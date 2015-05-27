var express = require('express');
var router = express.Router();
var render = require(__dirname + '/../lib/render');

/* GET users listing. */
router.get('/', function(req, res, next) {
  render(req, res, 200, 'index', { title: 'Users' });
});

module.exports = router;
