var crypto = require('crypto');

//Data from http://www.races.com.au/melbourne-cup/
var horses = {
    'Mihalic': 4.40
  , 'Pierrette': 9.00
  , 'Miss Idyllic': 17.00
  , 'Miss Loren': 21.00
  , 'Poppi Rox': 61.00
  , 'Cullemmy\'s Diamond': 18.00
  , 'Results': 26.00
  , 'Dagny': 31.00
  , 'Hello Hornsby': 26.00
  , 'Antelucan': 9.00
  , 'Charlie\'s Dream': 51.00
  , 'Comprende': 4.60
  , 'Lady Esprit': 6.50
  , 'The Grey Flash': 31.00
  , 'Thurlow': 6.00
  , 'Zarabeel': 31.00
  , 'Haybah': 18.00
  , 'Boomgal': 41.00
  , 'Shining Brooke': 21.00
  , 'Belhamage': 21.00
};

//Get the list of players from argv
var players = process.argv.slice(2);
if (!players.length) {
    console.log('Usage: node ./melbourne_cup.js [players..]');
    process.exit(0);
}

//Distribute horses into buckets
var buckets = {};
players.forEach(function (player) {
    buckets[player] = [];
});

//Sort horses by odds descending
horses = Object.keys(horses).map(function (name) {
    return { name: name, odds: horses[name] };
}).sort(function (a, b) {
    return a.odds < b.odds ? -1 : 1;
});

//Split out the bottom ranked horses so each player gets a fixed number of horses
var horse_count = Object.keys(horses).length
  , unaccounted_count = horse_count - Math.floor(horse_count / players.length) * players.length
  , unaccounted_for = horses.splice(horses.length - unaccounted_count);

//Give each player a top-ranked horse
shuffle(players).forEach(function (player) {
    buckets[player].push(horses.shift());
});

//Distribute the remaining horses randomly
shuffle(horses).forEach(function (horse, i) {
    var player = players[i % players.length];
    buckets[player].push(horse);
});

//Output the results
players.sort().forEach(function (player) {
    var odds = buckets[player].reduce(function (odds, horse) {
        return odds + 1 / horse.odds;
    }, 0);
    odds = round(1 / odds, 1);
    console.log('\n  \x1B[36m\x1B[1m%s\x1B[0m \x1B[31m%s\x1B[0m\n', player, odds);
    buckets[player].sort(function (a, b) {
        return a.odds < b.odds ? -1 : 1;
    }).forEach(function (horse) {
        console.log('    %s \x1B[32m%s\x1B[0m', horse.name, horse.odds);
    });
});

if (unaccounted_for.length) {
    console.log('\n  \x1B[33mUnaccounted for\x1B[0m\n');
    unaccounted_for.forEach(function (horse) {
        console.log('    %s \x1B[32m%s\x1B[0m', horse.name, horse.odds);
    });
}

process.stdout.write('\n');

function shuffle(array) {
    array.forEach(function (value, index) {
        var random = Math.floor(superRandom() * array.length);
        array[index] = array[random];
        array[random] = value;
    });
    return array;
}

function superRandom() {
    return crypto.randomBytes(1)[0] / 256;
}

function round(num, decimals) {
    var multiplier = Math.pow(10, decimals);
    return Math.round(num * multiplier) / multiplier;
}
