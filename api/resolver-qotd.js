var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var response;
  try {
    response = sync.await(request({
      url: 'http://api.theysaidso.com/qod.json',
      gzip: true,
      json: true,
      timeout: 15 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  //var data = response.body.data;
  var data = response.body.contents.quotes[0];
  var quotation = data.quote;
  var author = data.author;

  var html = '<p>Quote of the day:<br>' + '<i>' + quotation + '</i><br> - ' + author + '</p>'
  res.json({
    body: html
  });
};
