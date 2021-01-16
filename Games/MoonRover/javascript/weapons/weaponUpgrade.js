class Upgrade {
    constructor(cost, ...changes) {
        this.cost = cost;

        if (changes.length % 3) {
            console.error("Invalid weapon setup", this);
        }
        this.changes = [];
        for (let i=0; i<changes.length; i+=3) {
            this.changes.push({prop: changes[i+1], delta: changes[i+2], type: changes[i+0]});
        }
    }
    isActive = false;
    static Type = {
        "add": 0,
        "scale": 1
    }
}