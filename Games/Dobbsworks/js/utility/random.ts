// pseudo random number gen for things that could technically affect level outcome (hazard particle direction)

class Random {
    static seed = 0;
    static Reset(): void {
        this.seed = 0;
    }
    static random(): number {
        let seed = this.seed;
        this.seed++;
        return Math.abs(Math.sin(seed) * 100000) % 1;
    }
}