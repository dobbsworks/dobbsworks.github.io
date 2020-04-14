var drawHitboxes = false;

function SpriteBase(x, y) {
    this.active = true;

    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;

    this.executeRules = function () { };
    this.draw = function () { };
}




function Car(x, y) {
    SpriteBase.call(this, x, y);
    this.executeRules = function () {
    };
    this.draw = function () {

    };
}
Car.prototype = new SpriteBase();
Car.prototype.constructor = Car;


