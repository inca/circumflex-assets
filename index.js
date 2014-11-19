'use strict';

var path = require('path')
  , fs = require('fs')
  , AssetsCompiler = require('./compiler');

/**
 * Exposes middleware for emitting configured assets -- JS and CSS files.
 *
 * In development they are emitted separately, but in production they
 * are concatenated together and signed with hash.
 *
 * @param options
 * @returns {Function} Middleware function
 */
module.exports = function(options) {

  var root = options.assets.root
    , assetsJson = path.join(root, 'assets.json')
    , assetsCache = {};

  function init() {
    if (options.production)
      try {
        assetsCache = JSON.parse(fs.readFileSync(assetsJson, { encoding: 'utf-8' }));
        return;
      } catch(e) {
        console.warn(assetsJson + " missing or broken.");
      }
    // Fallback to default multi-files markup
    assetsCache = AssetsCompiler.parse(options);
  }

  function getBundle(bundleName) {
    return assetsCache[bundleName] || { js: [], css: [] };
  }

  init();

  /**
   * Exposing middleware.
   */
  return function assets(req, res, next) {

    var prefix = options.staticOrigin || '';

    /**
     * Emits script tags on your HTML page.
     *
     * @param bundleName Assets bundle name
     * @returns {string} HTML markup containing script tags
     */
    res.locals.emitJs = function(bundleName) {
      var bundle = getBundle(bundleName).js;
      if (!bundle.length) return;
      return bundle.map(function(js) {
        return '<script type="text/javascript" ' +
          'src="' + prefix + js.src + '"></script>';
      }).join('');
    };

    /**
     * Emits links with `rel='stylesheet'` to bind stylesheets to your page.
     *
     * @param bundleName Assets bundle name
     * @returns {string} HTML markup containing link tags
     */
    res.locals.emitCss = function(bundleName) {
      var bundle = getBundle(bundleName).css;
      if (!bundle.length) return;
      return bundle.map(function(css) {
        return '<link rel="stylesheet" ' +
          'href="' + prefix + css.href + '" ' +
          'media="' + css.media + '"/>';
      }).join('');
    };

    /**
     * Constructs a link to a static resource, appending its `mtime` to
     * ensure robust cache invalidation.
     *
     * @param resource Path to resource relative to `public` directory
     * @returns {string} Resource URI
     */
    res.locals.static = function(resource) {
      var uri = options.staticOrigin + resource;
      var file = path.join(options.assets.root, resource);
      try {
        return uri + "?" + fs.statSync(file).mtime.getTime();
      } catch (e) {
        return uri;
      }
    };

    next();
  };

};
