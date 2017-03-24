/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'get /': { view: 'index' },

  'post /api/yobee/quote': 'YobeeController.quote',
  'get /api/yobee/quotes/:id': 'YobeeController.getQuote',

  'post /api/bihu/reinsure': 'BihuController.reinsure',
  'post /api/bihu/quote': 'BihuController.quote',
  'get /api/bihu/quotes/:LicenseNo': 'BihuController.getQuote',

  'get /api/fanhua/cities/:cityid/providers': 'FanhuaController.providers',
  'post /api/fanhua/reinsure/:taskId': 'FanhuaController.reinsure',
  'post /api/fanhua/quotes/search': 'FanhuaController.searchQuote',
  'post /api/fanhua/cars/search': 'FanhuaController.carinfo',
  'post /api/fanhua/quote': 'FanhuaController.quote',
  'post /api/fanhua/quotes': 'FanhuaController.submitQuote',
  'get /api/fanhua/quotes': 'FanhuaController.getQuotes',
  'post /api/fanhua/result': 'FanhuaController.result',
  'get /api/fanhua/quotes/:taskId': 'FanhuaController.getQuote',
  'delete /api/fanhua/quotes/:taskId': 'FanhuaController.deleteQuote',
  'post /api/fanhua/quotes/:taskId/:prvId/images': 'FanhuaController.uploadImages',
  'post /api/fanhua/quotes/:taskId/pay': 'FanhuaController.pay',
  'post /api/fanhua/insures/:taskId': 'FanhuaController.insure',
  'post /api/fanhua/insures/:taskId/refund': 'FanhuaController.refund',

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
