var crypto = require('crypto');

//Data from http://www.races.com.au/2013/11/04/two-word-melbourne-cup-2013-form-guide/
var horses = {
    'Dunaden': 41
  , 'Green Moon': 41
  , 'Red Cadeaux': 31
  , 'Sea Moon': 14
  , 'Brown Panther': 19
  , 'Fiorente': 7.50
  , 'Foreteller': 31
  , 'Dandino': 12
  , 'Ethiopa': 81
  , 'Fawkner': 18
  , 'Mourayan': 126
  , 'Seville': 16
  , 'Super Cool': 51
  , 'Masked Marvel': 31
  , 'Mount Athos': 9.50
  , 'Royal Empire': 19
  , 'Voleuse De Coeurs': 17
  , 'Hawkspur': 17
  , 'Simenon': 17
  , 'Ibicenco': 101
  , 'Verema': 14
  , 'Dear Demi': 21
  , 'Tres Blue': 21
  , 'Ruscello': 61
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
