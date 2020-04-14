
function TerrainGenerator() {

    this.GenerateTerrain = function () {

        var hexes = [];

        var gen = new NoiseGenerator(32, 2);
        var treeNoise = new NoiseGenerator(32, 2);


        var hexHeight = Math.sqrt(3) + 0.2;
        var hexWidth = 1.5 + 0.2;

        var radius = 64;
        for (var i = -radius; i < radius; i++) {
            for (var j = -radius ; j < radius; j++) {
                var x = i * hexWidth;
                var y = (j + (i % 2 !== 0 ? 0 : 0.5)) * hexHeight;

                if (x * x + y * y > radius * radius) continue;
                var value = gen.getValue(i / 8, j / 8);
                var treeValue = treeNoise.getValue(i / 8, j / 8);
                hexes.push(new Hex(x, y, value, treeValue));
            }
        }

        return hexes;
    }


    function Hex(x, y, value, treeValue) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.treeValue = treeValue * 2 - 1;
        if (this.treeValue < 0) this.treeValue = 0;
        if (value <= 0.5) this.treeValue = 0;

        var r = value > 0.5 ? parseInt((value - 0.5) * 255) : 0;
        var g = value > 0.5 ? parseInt((value) * 255) : 0;
        var b = value > 0.5 ? parseInt((value - 0.5) * 255) : parseInt((value + 0.25) * 255);
        this.color = "rgb(" + r + "," + g + "," + b + ")";
    }
}
