
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}


module.exports = {shuffler: shuffleArray};


/*
exports.isUUIDv4 = function(uuid) {
    return (typeof uuid === 'string') && uuid.match(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
};

exports.isInt = function(nVal) {
    return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
};
exports.parseTimeString = function(str) {
    var reg   = /^\s*([1-9]\d*)([dhms])\s*$/;
    var match = str.match(reg);

    if (!match)
        return null;

    var num = parseInt(match[1]);
    switch (match[2]) {
    case 'd': num *= 24;
    case 'h': num *= 60;
    case 'm': num *= 60;
    case 's': num *= 1000;
    }

    assert(num > 0);
    return num;
};

exports.printTimeString = function(ms) {
    var days = Math.ceil(ms / (24*60*60*1000));
    if (days >= 3) return '' + days + 'd';

    var hours = Math.ceil(ms / (60*60*1000));
    if (hours >= 3) return '' + hours + 'h';

    var minutes = Math.ceil(ms / (60*1000));
    if (minutes >= 3) return '' + minutes + 'm';

    var seconds = Math.ceil(ms / 1000);
    return '' + seconds + 's';
};

function divisible(hash, mod) {
    // We will read in 4 hex at a time, but the first chunk might be a bit smaller
    // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
    var val = 0;

    var o = hash.length % 4;
    for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
        val = ((val << 16) + parseInt(hash.substring(i, i+4), 16)) % mod;
    }

    return val === 0;
}

*/