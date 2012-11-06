function randomSort(arr) {
    for (var i = 0; i < 1000; i++) {
        arr.sort(function (a, b) {
            return Math.random() < 0.5 ? -1 : 1;
        });
    }
    return arr;
}

function round(num, decimals) {
    var multiplier = Math.pow(10, decimals);
    return Math.round(num * multiplier) / multiplier;
}

//Data from puntersparadise.com.au/melbourne-cup/melbourne-cup-odds/
var horses = {
    'Dunaden': 7
  , 'Americain': 8
  , 'Jakkalberry': 71
  , 'Red Cadeaux': 8.5
  , 'Winchester': 61
  , 'Voila Ici': 121
  , 'Cavalryman': 26
  , 'Mount Athos': 7
  , 'Sanagas': 51
  , 'Ethiopia': 21
  , 'Fiorente': 41
  , 'Galileo\'s Choice': 16
  , 'Glencadam Gold': 41
  , 'Green Moon': 17
  , 'Maluckyday': 14
  , 'Mourayan': 31
  , 'My Quest for Peace': 17
  , 'Niwot': 61
  , 'Tac de Boistron': 101
  , 'Lights of Heaven': 17
  , 'Precedence': 81
  , 'Unusual Suspect': 101
  , 'Zabeelionaire': 51
  , 'Kelinni': 21
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

//Give each player a top-ranked horse
randomSort(players).forEach(function (player) {
    buckets[player].push(horses.shift());
});

//Distribute the remaining horses randomly
randomSort(horses).forEach(function (horse, i) {
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

console.log('');

