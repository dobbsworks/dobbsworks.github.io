function CommandRoll(user, args) {
    let rawRollString = args.join('').replace(/\s/g, '').toLowerCase();
    let hasInvalidChars = rawRollString.replace(/[\d,d,+,-]/g, '').length > 0;

    if (rawRollString.indexOf("d") === -1) {
        return 'Include "d" to indicate number of face on each die. Example usages: "!roll d6" or "!roll d20+3" or "!roll 3d8-d6"'
    }

    if (hasInvalidChars) {
        return 'Invalid roll! Example usages: "!roll d6" or "!roll d20+3" or "!roll 3d8-d6"'
    } else {
        rawRollString = rawRollString.replace(/\+/g, ",+").replace(/-/g, ",-");
        if (!rawRollString.startsWith("-") && !rawRollString.startsWith("+")) rawRollString = "+" + rawRollString;
        let rollGroups = rawRollString.split(",");
        let total = 0;
        let breakdowns = [];
        let totalDice = 0;
        for (let rollGroup of rollGroups) {
            if (rollGroup.indexOf("d") === -1) {
                // constant num
                let num = +(rollGroup.slice(1, rollGroup.length));
                //breakdowns.push(num);
                total += rollGroup.startsWith("+") ? num : -num;
            } else {
                let numDice = +(rollGroup.slice(1,rollGroup.indexOf("d")));
                totalDice += numDice;
                if (totalDice > 20) return "That's too many dice...";
                if (rollGroup.indexOf("d") === 1) numDice = 1;
                let numFaces = +(rollGroup.slice(rollGroup.indexOf("d")+1,rollGroup.length));
                let rolledNums = RollDice(numDice, numFaces);
                let sum = rolledNums.reduce((a,b)=>a+b,0);
                breakdowns.push(rolledNums);
                total += rollGroup.startsWith("+") ? sum : -sum;
            }
        }
        let ret = "You rolled a " + total + "!";
        if (totalDice > 1) ret += " " + breakdowns.map(x => "[" + x.toString() + "]").join(",");
        return ret;
    }
}
function RollDice(n, d) {
    let ret = [];
    for (let i=0; i<n; i++) ret.push(Math.ceil(Math.random()*d));
    return ret;
}