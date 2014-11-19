'use strict';

var app = require('express')()
  , path = require('path');

module.exports = exports = function(cb) {
  require('http').createServer(app).listen(8123, cb);
};

exports.conf = {
  staticOrigin: '//static.circumflexapp.dev',
  assets: {
    root: path.join(__dirname, './public'),
    global: [
      '/css/main.css',
      { href: '/css/print.css', media: 'print' },
      '/js/lib.js',
      '/js/app.js'
    ]
  }
};

app.use(require('../../index')(exports.conf));

app.get('/emitCss', function(req, res, next) {
  res.send(res.locals.emitCss('global'));
});

app.get('/emitJs', function(req, res, next) {
  res.send(res.locals.emitJs('global'));
});
