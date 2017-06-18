const fs = require('fs');
const cheerio = require('cheerio');

module.exports.load = function(fileName) {
  const html = fs.readFileSync(fileName, {encoding: 'utf-8'});
  return cheerio.load(html);
};

module.exports.text = function($el, query) {
  return $el.find(query).text().replace(/\s+/g, ' ').trim();
};
