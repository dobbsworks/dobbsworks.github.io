var EncodeUtility = (function () {
    function EncodeUtility() {
        this.key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789' + '+/' +
            '¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘ' +
            'ęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸ' +
            'ŹźŻżŽžſƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘ' +
            'ǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿȀȁȂȃȄȅȆȇ';
    }
    // b64 + char codes 185 - 519
    EncodeUtility.prototype.CharToNumber = function (c) {
        if (c.length !== 1)
            throw 'Invalid input, expected one character, received ' + c;
        var index = this.key.indexOf(c);
        if (index !== -1)
            return index;
        throw 'Invalid input, expected alphanumeric character or + or /, received ' + c;
    };
    EncodeUtility.prototype.NumberToChar = function (n) {
        if (n < 0 || n > this.key.length - 1 || isNaN(n) || n === null || n % 1 !== 0)
            throw 'Invalid input, expected integer in [0,' + (this.key.length - 1) + '], received ' + n.toString();
        return this.key[n];
    };
    EncodeUtility.prototype.EncodeSlice = function (arr) {
        var me = this;
        var flattenedArray = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var line = arr_1[_i];
            flattenedArray.push.apply(flattenedArray, line);
        }
        function Append(count, tile) {
            if (tile === -1)
                return;
            while (count > me.key.length) {
                count -= me.key.length;
                ret += me.NumberToChar(me.key.length - 1) + me.NumberToChar(tile);
            }
            ret += me.NumberToChar(count - 1) + me.NumberToChar(tile);
        }
        var ret = "";
        var currentTile = -1;
        var tileCount = 0;
        while (flattenedArray.length > 0) {
            var prevTile = currentTile;
            currentTile = flattenedArray.splice(0, 1)[0];
            if (prevTile === currentTile)
                tileCount++;
            else {
                Append(tileCount, prevTile);
                tileCount = 1;
            }
        }
        if (tileCount !== 0)
            Append(tileCount, currentTile);
        return ret;
    };
    EncodeUtility.prototype.DecodeSlice = function (str) {
        var _this = this;
        var numbers = str.split('').map(function (x) { return _this.CharToNumber(x); });
        var flattenedArray = [];
        for (var i = 0; i < numbers.length; i += 2) {
            var count = numbers[i] + 1;
            var tile = numbers[i + 1];
            for (var j = 0; j < count; j++)
                flattenedArray.push(tile);
        }
        var ret = [];
        var arrayLen = mapSize;
        for (var i = 0; i < arrayLen; i++) {
            ret.push(flattenedArray.splice(0, arrayLen));
        }
        return ret;
    };
    return EncodeUtility;
}());
//# sourceMappingURL=EncodeUtility.js.map