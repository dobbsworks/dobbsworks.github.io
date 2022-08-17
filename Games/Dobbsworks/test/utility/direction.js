"use strict";
var Direction = /** @class */ (function () {
    function Direction(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
    }
    Direction.prototype.Opposite = function () {
        if (this == Direction.Right)
            return Direction.Left;
        if (this == Direction.Left)
            return Direction.Right;
        if (this == Direction.Up)
            return Direction.Down;
        if (this == Direction.Down)
            return Direction.Up;
        throw "uh oh";
    };
    Direction.Left = new Direction(-1, 0, "Left");
    Direction.Right = new Direction(1, 0, "Right");
    Direction.Up = new Direction(0, -1, "Up");
    Direction.Down = new Direction(0, 1, "Down");
    Direction.All = [Direction.Left, Direction.Right, Direction.Down, Direction.Up];
    return Direction;
}());
