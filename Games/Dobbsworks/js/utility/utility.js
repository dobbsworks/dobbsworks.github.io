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
    Utility.MsToTimeText = function (ms) {
        var days = Math.floor(ms / 1000 / 60 / 60 / 24);
        var hours = Math.floor(ms / 1000 / 60 / 60) % 24;
        var minutes = Math.floor(ms / 1000 / 60) % 60;
        var seconds = Math.floor(ms / 1000) % 60;
        if (ms < 1)
            return "Time's up!";
        return (days ? (days.toString() + " day" + (days == 1 ? "" : "s") + " ") : "") +
            ((days || hours) ? (hours.toString() + " hour" + (hours == 1 ? "" : "s") + " ") : "") +
            ((days || hours || minutes) ? (minutes.toString() + " minute" + (minutes == 1 ? "" : "s") + " ") : "") +
            ((days || hours) ? "" : (seconds.toString() + " second" + (seconds == 1 ? "" : "s") + " "));
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
    Utility.GetClosestInList = function (listOfNumbers, targetNumber) {
        if (listOfNumbers.length == 0)
            return null;
        var currentClosest = listOfNumbers[0];
        var currentDistance = Math.abs(targetNumber - currentClosest);
        for (var index = 1; index < listOfNumbers.length; index++) {
            var thisNumber = listOfNumbers[index];
            var thisDistance = Math.abs(targetNumber - thisNumber);
            if (thisDistance < currentDistance) {
                currentDistance = thisDistance;
                currentClosest = thisNumber;
            }
        }
        return currentClosest;
    };
    Utility.RandFrom = function (list) {
        if (list.length == 0) {
            throw "RandFrom called on empty list";
        }
        if (list.length == 0)
            return list[0];
        var index = Math.floor(Math.random() * list.length);
        return list[index];
    };
    Utility.IsOnSegment = function (p, q, r) {
        return (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y));
    };
    Utility.GetOrientation = function (p, q, r) {
        var val = (q.y - p.y) * (r.x - q.x) -
            (q.x - p.x) * (r.y - q.y);
        if (val == 0)
            return 0; // collinear
        return (val > 0) ? 1 : 2; // clock or counterclock wise
    };
    // The main function that returns true if line segment 'p1q1'
    // and 'p2q2' intersect.
    Utility.DoLinesIntersect = function (p1, q1, p2, q2) {
        // Find the four orientations needed for general and
        // special cases
        var o1 = Utility.GetOrientation(p1, q1, p2);
        var o2 = Utility.GetOrientation(p1, q1, q2);
        var o3 = Utility.GetOrientation(p2, q2, p1);
        var o4 = Utility.GetOrientation(p2, q2, q1);
        // General case
        if (o1 != o2 && o3 != o4)
            return true;
        // Special Cases
        // p1, q1 and p2 are collinear and p2 lies on segment p1q1
        if (o1 == 0 && Utility.IsOnSegment(p1, p2, q1))
            return true;
        // p1, q1 and q2 are collinear and q2 lies on segment p1q1
        if (o2 == 0 && Utility.IsOnSegment(p1, q2, q1))
            return true;
        // p2, q2 and p1 are collinear and p1 lies on segment p2q2
        if (o3 == 0 && Utility.IsOnSegment(p2, p1, q2))
            return true;
        // p2, q2 and q1 are collinear and q1 lies on segment p2q2
        if (o4 == 0 && Utility.IsOnSegment(p2, q1, q2))
            return true;
        return false; // Doesn't fall in any of the above cases
    };
    Utility.IsBetween = function (x, a, b) {
        if (x <= a && x >= b)
            return true;
        if (x >= a && x <= b)
            return true;
        return false;
    };
    Utility.Lerp = function (from, to, weight) {
        return from + (to - from) * weight;
    };
    Utility.Approach = function (from, to, amount) {
        if (Math.abs(from - to) <= amount)
            return to;
        if (from < to)
            return from + amount;
        return from - amount;
    };
    // static LerpColor(from: string, to: string, weight: number): string {
    //     let hsl1 = rgbStringToHSL(from);
    //     let hsl2 = rgbStringToHSL(to);
    //     if (Math.abs(hsl2.h - hsl1.h) > 180) {
    //         if (hsl1.h > 180) hsl1.h -= 360;
    //         if (hsl2.h > 180) hsl2.h -= 360;
    //     }
    //     let hslNew = {
    //         h: Utility.Lerp(hsl1.h, hsl2.h, weight) % 360,
    //         s: Utility.Lerp(hsl1.s, hsl2.s, weight),
    //         l: Utility.Lerp(hsl1.l, hsl2.l, weight),
    //     };
    //     return hslToRGB(hslNew);
    // }
    Utility.ApproachColor = function (from, to, speed) {
        var rgbToInts = function (rgb) {
            return [0, 1, 2].map(function (n, i) {
                var a = rgb.replace("#", "");
                var l = Math.floor(a.length / 3);
                var s = i * l;
                var sub = a.substring(s, s + l);
                return parseInt(sub, 16);
            });
        };
        var rgb1 = rgbToInts(from);
        var rgb2 = rgbToInts(to);
        for (var i = 0; i < 3; i++) {
            if (Math.abs(rgb1[i] - rgb2[i]) <= speed)
                rgb1[i] = rgb2[i];
            if (rgb1[i] < rgb2[i])
                rgb1[i] += speed;
            if (rgb1[i] > rgb2[i])
                rgb1[i] -= speed;
        }
        return "#" + rgb1.map(function (a) { return a.toString(16).padStart(2, "00"); }).join("");
    };
    Utility.b64Str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return Utility;
}());
