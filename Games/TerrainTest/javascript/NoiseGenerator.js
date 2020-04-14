function NoiseGenerator(size, iterations) {
    // Creates a random mesh of values (0,1) for x and y [0, size)
    // that loops around at edges

    this.iterations = iterations;

    this.seedData = [];
    for (var i = 0; i < size; i++) {
        var line = [];
        for (var j = 0; j < size; j++) {
            line.push(Math.random());
        }
        this.seedData.push(line);
    }
    this.seedData[0][0] = 1;

    this.getValue = function (x, y) {
        function getRawValue(seedData, x, y) {
            // Only pass this function integers
            while (x < 0) x += seedData[0].length;
            while (y < 0) y += seedData.length;
            return seedData[y % seedData.length][x % seedData[0].length];
        }

        function weightedAverage(valA, valB, ratio) {
            return valA * (1 - ratio) + valB * ratio;
        }

        function getInterpolatedValue(seedData, x, y) {
            var xLow = parseInt(x);
            if (x != parseInt(x) && x < 0) xLow -= 1;
            var xRatio = x - xLow;
            var yLow = parseInt(y);
            if (y != parseInt(y) && y < 0) yLow -= 1;
            var yRatio = y - yLow;

            var topLeft = getRawValue(seedData, xLow, yLow);
            var topRight = getRawValue(seedData, xLow + 1, yLow);
            var bottomLeft = getRawValue(seedData, xLow, yLow + 1);
            var bottomRight = getRawValue(seedData, xLow + 1, yLow + 1);

            // May need to change lerp function for better curves
            var topValue = weightedAverage(topLeft, topRight, xRatio);
            var bottomValue = weightedAverage(bottomLeft, bottomRight, xRatio);


            var val = weightedAverage(topValue, bottomValue, yRatio);
            return (val * val * (3 - 2 * val));
        }

        var ret = 0;
        for (var i = 0; i < this.iterations; i++) {
            var pow = Math.pow(2, i);
            ret += pow * getInterpolatedValue(this.seedData, x * pow, y * pow);
        }
        return ret / (Math.pow(2, this.iterations) - 1);
    }
}
