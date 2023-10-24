function onlyUnique<T>(value: T, index: number, array: T[]) {
    return array.indexOf(value) === index;
}

function NumberToOrdinal(n: number) {
    if (n <= 0) return "?th";
    if (n == 1) return "1st";
    if (n == 2) return "2nd";
    if (n == 3) return "3rd";
    else return n + "th";
    // yes this will be slightly wrong beyond 20, but please don't play a 20-player game
}