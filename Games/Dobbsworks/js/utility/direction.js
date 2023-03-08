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
    Direction.prototype.Clockwise = function () {
        if (this == Direction.Right)
            return Direction.Down;
        if (this == Direction.Left)
            return Direction.Up;
        if (this == Direction.Up)
            return Direction.Right;
        if (this == Direction.Down)
            return Direction.Left;
        throw "uh oh";
    };
    Direction.prototype.CounterClockwise = function () {
        if (this == Direction.Right)
            return Direction.Up;
        if (this == Direction.Left)
            return Direction.Down;
        if (this == Direction.Up)
            return Direction.Left;
        if (this == Direction.Down)
            return Direction.Right;
        throw "uh oh";
    };
    Direction.Left = new Direction(-1, 0, "Left");
    Direction.Right = new Direction(1, 0, "Right");
    Direction.Up = new Direction(0, -1, "Up");
    Direction.Down = new Direction(0, 1, "Down");
    Direction.All = [Direction.Up, Direction.Right, Direction.Down, Direction.Left];
    return Direction;
}());
