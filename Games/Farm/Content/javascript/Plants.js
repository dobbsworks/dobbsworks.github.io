

var BasicPlant = {
    //    SpriteBase.call(this, x + width / 2, y + height / 2);
    //    this.width = width;

    name: "Plant1",
    hotkey: 50, // key 1
    cost: 10,

    canPlace: function (cell) {
        return cell.sprouts.length == 0;
    },

    place: function (cell) {
        cell.addSprouts();
    }
}
//Wall.prototype = new SpriteBase();
//BasicPlant.prototype.constructor = BasicPlant;


itemTypes.push(BasicPlant);