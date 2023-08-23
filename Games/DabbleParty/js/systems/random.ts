class Random {
    private static _seed = 1;

    public static SetSeed(seed: number): void {
        this._seed = seed;
    }

    public static GetRand(): number {
        Random._seed++;
        return Math.abs(1000 * Math.sin(Random._seed)) % 1;
    }

    public static GetRandInt(lowestInt: number, highestInt: number): number {
        lowestInt = Math.floor(lowestInt);
        highestInt = Math.floor(highestInt);
        let rand = Random.GetRand();
        let range = highestInt - lowestInt + 1;
        return lowestInt + Math.ceil(rand * range) - 1;
    }

    public static GetRandIntFrom1ToNum(highestInt: number): number {
        return Random.GetRandInt(1, highestInt);
    }


    public static RandFrom<T>(list: T[]): T {
        if (list.length == 0) {
            throw "RandFrom called on empty list";
        }
        if (list.length == 1) return list[0];
        let index = Random.GetRandInt(0, list.length - 1);
        return list[index];
    }


    public static GetShuffledCopy<T>(list: T[]): T[] {
        let ret = [];
        let copy = [...list];
        for (let i = 0; i < list.length; i++) {
            let indexToRemove = Random.GetRandInt(0, copy.length - 1);
            let el = copy.splice(indexToRemove, 1)[0];
            ret.push(el);
        }
        return ret;
    }
}