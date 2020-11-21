class Level {
    constructor(rooms) {
        this.rooms = rooms;
    }
}

class Room {
    constructor(w,h) {
        this.width = w;
        this.height = h;
    }
    platforms = [];
}