"use strict";
var Utility = /** @class */ (function () {
    function Utility() {
    }
    Utility.Round = function (n) {
        return +(n.toFixed(3));
    };
    Utility.OnlyUnique = function (value, index, self) {
        return self.indexOf(value) === index;
    };
    Utility.Sum = function (a, b) {
        return a + b;
    };
    Utility.toTwoDigitB64 = function (num) {
        return Utility.b64Str[Math.floor(num / 64)] + Utility.b64Str[num % 64];
    };
    Utility.IntFromB64 = function (b64) {
        var digits = b64.split("");
        var ret = 0;
        var scale = 1;
        while (digits.length) {
            var digit = digits.pop();
            if (digit) {
                var value = Utility.b64Str.indexOf(digit);
                ret += value * scale;
                scale *= 64;
            }
        }
        return ret;
    };
    Utility.FramesToTimeText = function (frameCount) {
        var minutes = Math.floor(frameCount / 60 / 60);
        var seconds = Math.floor(frameCount / 60) % 60;
        var milliseconds = Math.floor((frameCount % 60) / 60 * 1000);
        return minutes.toString().padStart(2, "0") + ":" +
            seconds.toString().padStart(2, "0") + "." +
            milliseconds.toString().padStart(3, "0");
    };
    Utility.PascalCaseToSpaces = function (text) {
        var ret = "";
        var letters = text.split("");
        for (var _i = 0, letters_1 = letters; _i < letters_1.length; _i++) {
            var letter = letters_1[_i];
            if (letter == letter.toUpperCase() && ret.length != 0) {
                ret += " " + letter;
            }
            else {
                ret += letter;
            }
        }
        return ret;
    };
    Utility.Xor = function (con1, con2) {
        return (con1 && !con2) || (!con1 && con2);
    };
    Utility.b64Str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return Utility;
}());
