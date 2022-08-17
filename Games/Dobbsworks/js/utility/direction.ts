class Direction {
    private constructor(public x: number, public y: number, public name: string) {}

    static Left: Direction = new Direction(-1, 0, "Left");
    static Right: Direction = new Direction(1, 0, "Right");
    static Up: Direction = new Direction(0, -1, "Up");
    static Down: Direction = new Direction(0, 1, "Down");

    Opposite(): Direction {
        if (this == Direction.Right) return Direction.Left;
        if (this == Direction.Left) return Direction.Right;
        if (this == Direction.Up) return Direction.Down;
        if (this == Direction.Down) return Direction.Up;
        throw "uh oh";
    }
    Clockwise(): Direction {
        if (this == Direction.Right) return Direction.Down;
        if (this == Direction.Left) return Direction.Up;
        if (this == Direction.Up) return Direction.Right;
        if (this == Direction.Down) return Direction.Left;
        throw "uh oh";
    }
    CounterClockwise(): Direction {
        if (this == Direction.Right) return Direction.Up;
        if (this == Direction.Left) return Direction.Down;
        if (this == Direction.Up) return Direction.Left;
        if (this == Direction.Down) return Direction.Right;
        throw "uh oh";
    }

    static All: Direction[] = [Direction.Left, Direction.Right, Direction.Down, Direction.Up];
}