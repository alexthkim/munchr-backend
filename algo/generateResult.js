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

  const cuisines = ['korean_japanese', 'european', 'american', 'mexican'];
  const cats = ['brunch', 'snack', 'noodles', 'rice', 'sushi', 'burger'];
  let cuisineScores = {};
  let catScores = {};

  const asianScore = getScore('asian', cards);
  const healthyScore = getScore('healthy', cards);
  let highestCuisine = 0;
  let bestCuisine = '';
  let highestCat = 0;
  let bestCat = '';

  for (let i=0; i<cuisines.length; i++) {
    if (getScore(cuisines[i], cards) > highestCuisine) {
      highestCuisine = getScore(cuisines[i], cards);
      bestCuisine = cuisines[i]
    }
    cuisineScores[cuisines[i]] = ({
      cuisine: cuisines[i],
      score: getScore(cuisines[i], cards)
    });
  };
  for (let i=0; i<cats.length; i++) {
    if (getScore(cats[i], cards) > highestCat) {
      highestCat = getScore(cats[i], cards);
      bestCat = cats[i]
    }
    catScores[cats[i]] = ({
      cuisine: cats[i],
      score: getScore(cats[i], cards)
    });
  };

  const rankedCuisineScores = _.sortBy(cuisineScores, x => -x.score);
  const rankedCatScores = _.sortBy(catScores, x => -x.score);

  console.log(asianScore);
  console.log(healthyScore);
  console.log(rankedCuisineScores);
  console.log(rankedCatScores);
  console.log(bestCat);
  console.log(bestCuisine);

  if (asianScore > 2.6) {
    result.push('asian');
  };

  if (cuisineScores[bestCuisine].score > 2.6) {
    if (catScores[bestCat].score > 1.9) {
      result.push(bestCuisine + '+' + bestCat);
    } else {
      result.push(bestCat);
    }
  } else  if (catScores[bestCat].score > 1.9) {
    if (cuisineScores[bestCuisine].score > 1.9) {
      result.push(bestCuisine + '+' + bestCat);
    } else {
      result.push(bestCuisine);
    }
  } else {
    if (highestCuisine > highestCat) {
      if (highestCuisine > 0) results.push(bestCuisine);
    } else {
      if (highestCat > 0) results.push(bestCat);
    };
  };

  if (healthyScore > 2.9) {
    results.push('healty');
  };
  if (catScores['noodles'].score > 0.9) {
    results.push('ramen');
    results.push('udon');
  };
  if (catScores['sushi'].score > 0.9) {
    results.push('sushi');
  };
  if (catScores['burger'].score > 0.9) {
    results.push('burger');
  };
  if (catScores['rice'].score > 2.7) {
    results.push('rice');
  };

  if (results.length > 2) {
    results = results.slice(0,2);
  };

  if (results.length == 0) {
    results = ['shit'];
  };

  results = results.map(x => x + '+food');

  return results;
};

const getScore = (category, cards) => (
  _.reduce(cards, (sum, card) => {
    (card[category] && card['swipeRight']) ? sum += 1 : sum;
    (card[category] && !card['swipeRight']) ? sum -= 0.3 : sum;
    return sum;
  }, 0)
);

module.exports = generateResult;
