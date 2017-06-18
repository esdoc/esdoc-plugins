const fs = require('fs');

const md = fs.readFileSync('./test/out/index.md').toString();
const lines = md.split('\n');

module.exports.hasLine = function hasLine(line) {
  return lines.includes(line);
};
