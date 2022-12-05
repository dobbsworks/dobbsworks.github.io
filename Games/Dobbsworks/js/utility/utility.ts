class Utility {
    public static Round(n: number): number {
        return +(n.toFixed(3));
    }

    public static OnlyUnique(value: any, index: number, self: any) {
        return self.indexOf(value) === index;
    }

    public static Sum(a: number, b: number): number {
        return a + b;
    }

    public static b64Str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    public static toTwoDigitB64(num: number): string {
        return Utility.b64Str[Math.floor(num / 64)] + Utility.b64Str[num % 64];
    }

    public static IntFromB64(b64: string): number {
        let digits = b64.split("");
        let ret = 0;
        let scale = 1;
        while (digits.length) {
            let digit = digits.pop();
            if (digit) {
                let value = Utility.b64Str.indexOf(digit);
                ret += value * scale;
                scale *= 64;
            }
        }
        return ret;
    }

    public static FramesToTimeText(frameCount: number): string {

        let minutes = Math.floor(frameCount / 60 / 60);
        let seconds = Math.floor(frameCount / 60) % 60;
        let milliseconds = Math.floor((frameCount % 60) / 60 * 1000);

        return minutes.toString().padStart(2, "0") + ":" +
            seconds.toString().padStart(2, "0") + "." +
            milliseconds.toString().padStart(3, "0");
    }

    public static PascalCaseToSpaces(text: string): string {
        let ret = "";

        let letters = text.split("");
        for (let letter of letters) {
            if (letter == letter.toUpperCase() && ret.length != 0) {
                ret += " " + letter;
            } else {
                ret += letter;
            }
        }


        return ret;
    }

    public static Xor(con1: boolean, con2: boolean): boolean {
        return (con1 && !con2) || (!con1 && con2);
    }

    public static GetClosestInList(listOfNumbers: number[], targetNumber: number): number | null {
        if (listOfNumbers.length == 0) return null;

        let currentClosest = listOfNumbers[0];
        let currentDistance = Math.abs(targetNumber - currentClosest);
        for (let index = 1; index < listOfNumbers.length; index++) {
            let thisNumber = listOfNumbers[index];
            let thisDistance = Math.abs(targetNumber - thisNumber);
            if (thisDistance < currentDistance) {
                currentDistance = thisDistance;
                currentClosest = thisNumber;
            }
        }

        return currentClosest;
    }


    public static RandFrom<T>(list: T[]): T {
        if (list.length == 0) {
            throw "RandFrom called on empty list";
        }
        if (list.length == 0) return list[0];
        let index = Math.floor(Math.random() * list.length)
        return list[index];
    }
}