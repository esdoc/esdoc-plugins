const fs = require('fs');

exports.find = function(key, ...values) {
  if (values.length === 1) {
    return global.docs.find((doc) => {
      if (typeof values[0] === 'string') return doc[key] === values[0];
      if (values[0] instanceof RegExp) return doc[key].match(values[0]);
    });
  }

  const results = [];
  for (const value of values) {
    const result = global.docs.find(doc => {
      if (typeof value === 'string') return doc[key] === value;
      if (value instanceof RegExp) return doc[key] && doc[key].match(value);
    });

    results.push(result);
  }

  return results;
};

exports.file = function (filePath) {
  return fs.readFileSync(filePath).toString();
};

