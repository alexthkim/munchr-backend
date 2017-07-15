const _ = require('underscore');

const data = require('../data/munchrData');

// cards will be an array of objs {ID, URL, swipeRight}
const generateAndAnalyze = (userId, cards) => {
  cards = _.map(cards, card => data[card['ID']])
}

module.exports = generateAndAnalyze;
