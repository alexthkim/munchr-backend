const _ = require('underscore');

const data = require('../data/munchrData');

const generateInitial = (/* userId */) => {
  return _.shuffle(data).slice(0,15);
}

module.exports = generateInitial;
