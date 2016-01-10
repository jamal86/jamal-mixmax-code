var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');
var parseString = require('xml2js').parseString;

// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();
    handleSearchString(term, req, res);
};

function handleSearchString(term, req, res) {
  var response;
  try {
    response = sync.await(request({
      url: 'http://www.stands4.com/services/v2/quotes.php',
      qs: {
        uid: key.uid,
        tokenid: key.tokenid,
        searchtype: key.searchtype,
        query: term,
      },
      gzip: true,
      json: true,
      timeout: 15 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  var xml = response.body;
  parseString(xml, {trim: true}, function (err, output) {
    var quotes = output.results.result;
    if (!quotes || !quotes.length) {
      sendResponse(req, res, 'No Quote Found!');
    }
    else {
      var randomQuote = quotes[getRandomInt(0, quotes.length)];
      formQuoteAndSendResponse(req, res, randomQuote, term);
    }
  });
}

function formQuoteAndSendResponse(req, res, quoteInfo, term) {
  var quotation = quoteInfo.quote[0];
  var author = quoteInfo.author[0];
  var html = '<p>Random "' + term + '" quote:<br>' + '<i>' + quotation + '</i><br> - ' + author + '</p>'
  sendResponse(req, res, html);
}

function sendResponse(req, res, html) {
  res.json({
    body: html
  });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
