const _ = require('underscore');

const data = require('../data/munchrData');

// cards will be an array of objs {ID, URL, swipeRight}
const generateResult = (userId, cards) => {
  let results = []
  const nb_cards = cards.length;
  cards = _.map(cards, card => {
    let returnCard = JSON.parse(JSON.stringify(data[card['ID']]));
    returnCard['swipeRight'] = card['swipeRight'];
    return returnCard;
  })

  const cuisines = ['asian', 'western', 'korean_japanese', 'european', 'american'];
  let cuisineScores = [];

  for (let i=0; i<cuisines.length; i++) {
    cuisineScores.push({
      cuisine: cuisines[i],
      score: getScore(cuisines[i], cards)
    })
  }

  cuisineScores = _.sortBy(cuisineScores, cuisine => -cuisine.score);

  results.push(cuisineScores[0].cuisine);
  if (cuisineScores[1].score > 0.4 * nb_cards) results.push(cuisineScores[1].cuisine);

  return results;
};

const getScore = (category, cards) => (
  _.reduce(cards, (sum, card) => (
    card[category] && card['swipeRight'] ? sum + 1 : sum
  ), 0)
);

// const test_cards = [
//   {
//     ID: 0,
//     URL: data[0].URL,
//     swipeRight: true,
//   },
//   {
//     ID: 1,
//     URL: data[1].URL,
//     swipeRight: true,
//   },
//   {
//     ID: 2,
//     URL: data[2].URL,
//     swipeRight: true,
//   },
//   {
//     ID: 3,
//     URL: data[3].URL,
//     swipeRight: true,
//   },
//   {
//     ID: 4,
//     URL: data[4].URL,
//     swipeRight: true,
//   }
// ]
//
// console.log(generateResult('TBI', test_cards));

module.exports = generateResult;
