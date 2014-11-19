"use strict";

var request = require('request')
  , assert = require('assert');

describe('Assets middleware', function() {

  before(function(cb) {
    require('./mock/app')(cb);
  });

  describe('emitCss', function() {

    it('renders markup in development', function(cb) {
      request.get('http://localhost:8123/emitCss',
        function(err, res, body) {
          if (err) return cb(err);
          assert.equal(body,
              '<link rel="stylesheet" href="//static.circumflexapp.dev/css/main.css" media="screen, projection"/>' +
              '<link rel="stylesheet" href="//static.circumflexapp.dev/css/print.css" media="print"/>');
          cb();
        });
    });

  });

  describe('emitJs', function() {

    it('renders markup in development', function(cb) {
      request.get('http://localhost:8123/emitJs',
        function(err, res, body) {
          if (err) return cb(err);
          assert.equal(body,
              '<script type="text/javascript" src="//static.circumflexapp.dev/js/lib.js"></script>' +
              '<script type="text/javascript" src="//static.circumflexapp.dev/js/app.js"></script>');
          cb();
        });
    });

  });

});
