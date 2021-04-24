class RandomSeedHandler {

    seed = 10000 * Math.random();

    random() {
        this.seed += 1;
        return (10000 * Math.abs(Math.sin(this.seed))) % 1;
    }

}