var Character = (function () {
    function Character(name, iconIndex) {
        this.name = name;
        this.iconIndex = iconIndex;
        this.LoadIcon();
    }
    Character.prototype.ToHtml = function () {
        var img = document.createElement("img");
        img.src = this.iconSrc;
        img.title = this.name;
        img.classList.add("icon");
        var div = document.createElement("div");
        div.classList.add("charName");
        div.innerText = this.name;
        var container = document.createElement("div");
        container.classList.add("cell");
        container.appendChild(div);
        container.appendChild(img);
        return container.outerHTML;
    };
    Character.prototype.LoadIcon = function () {
        var sourceImage = (document.getElementById("icons"));
        var imageWidth = 74;
        var imageHeight = 74;
        var x = this.iconIndex % 10 * imageWidth;
        var y = Math.floor(this.iconIndex / 10) * imageHeight;
        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = imageWidth;
        tempCanvas.height = imageHeight;
        var ctx = tempCanvas.getContext("2d");
        ctx.drawImage(sourceImage, x, y, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);
        this.iconSrc = tempCanvas.toDataURL();
    };
    return Character;
}());
var characters = [];
function GetCharacters() {
    if (characters.length === 0)
        characters = [
            new Character("Bayonetta", 1),
            new Character("Bowser", 3),
            new Character("Bowser Jr.", 4),
            new Character("Captain Falcon", 22),
            new Character("Chrom", 6),
            new Character("Cloud", 7),
            new Character("Corrin", 10),
            new Character("Daisy", 12),
            new Character("Dark Pit", 16),
            new Character("Dark Samus", 18),
            new Character("Diddy Kong", 14),
            new Character("Donkey Kong", 15),
            new Character("Dr. Mario", 17),
            new Character("Duck Hunt", 20),
            new Character("Falco", 21),
            new Character("Fox", 23),
            new Character("Ganondorf", 25),
            new Character("Greninja", 26),
            new Character("Ice Climbers", 27),
            new Character("Ike", 30),
            new Character("Inkling", 33),
            new Character("Isabelle", 35),
            new Character("Incineroar", 32),
            new Character("Jigglypuff", 73),
            new Character("Ken", 37),
            new Character("King Dedede", 13),
            new Character("King K. Rool", 40),
            new Character("Kirby", 38),
            new Character("Link", 43),
            new Character("Little Mac", 45),
            new Character("Lucario", 46),
            new Character("Lucas", 47),
            new Character("Lucina", 48),
            new Character("Luigi", 51),
            new Character("Mario", 52),
            new Character("Marth", 53),
            new Character("Mega Man", 54),
            new Character("Meta Knight", 60),
            new Character("Mewtwo", 55),
            new Character("Mii Brawler", 56),
            new Character("Mii Swordfighter", 58),
            new Character("Mii Gunner", 57),
            new Character("Mr. Game & Watch", 24),
            new Character("Ness", 62),
            new Character("Olimar", 63),
            new Character("Pac-Man", 64),
            new Character("Palutena", 65),
            new Character("Peach", 66),
            new Character("Pichu", 67),
            new Character("Pikachu", 68),
            new Character("Pit", 70),
            new Character("Richter", 74),
            new Character("Ridley", 75),
            new Character("R.O.B.", 76),
            new Character("Robin", 78),
            new Character("Rosalina & Luma", 80),
            new Character("Roy", 81),
            new Character("Ryu", 83),
            new Character("Samus", 84),
            new Character("Sheik", 85),
            new Character("Shulk", 86),
            new Character("Simon", 87),
            new Character("Snake", 88),
            new Character("Sonic", 9),
            new Character("Toon Link", 29),
            new Character("Villager", 49),
            new Character("Wario", 59),
            new Character("Wii Fit Trainer", 79),
            new Character("Wolf", 90),
            new Character("Yoshi", 91),
            new Character("Young Link", 92),
            new Character("Zelda", 93),
            new Character("Zero Suit Samus", 94),
            new Character("Pokémon Trainer", 72),
            new Character("Piranha Plant", 95) //[19,36,71,72,5]
        ];
    return characters;
}
function GetRandomCharacter() {
    return RandFromArray(GetCharacters());
}
function GetRandomUnusedCharacter(usedCharacters) {
    var unused = GetCharacters().filter(function (x) { return usedCharacters.indexOf(x) === -1; });
    return RandFromArray(unused);
}
function RandFromArray(list) {
    return list[Math.floor(RandomFromSeed() * list.length)];
}
var randomSeed = 0;
function GetRandomSeed() {
    return Math.floor(+(new Date()) * Math.random());
}
function SetRandomSeed(value) {
    randomSeed = value;
    document.getElementById("seed").setAttribute("value", value.toString());
}
function RandomFromSeed() {
    randomSeed += 1;
    return (10000 * Math.abs(Math.sin(randomSeed))) % 1;
}
function NewRandomBoard() {
    SetRandomSeed(GetRandomSeed());
    RefreshBoard();
}
function GetTodaysBoard() {
    SetRandomSeed(GetDailySeed());
    RefreshBoard();
}
function BoardFromSeed() {
    var input = (document.getElementById("seed"));
    SetRandomSeed(+input.value);
    RefreshBoard();
}
function OnLoad() {
    NewRandomBoard();
}
function RefreshBoard() {
    var allowRepeats = false;
    var container = document.getElementById("main");
    container.innerHTML = "";
    var table = document.createElement("table");
    var usedChars = [];
    for (var i = 0; i < 5; i++) {
        var row = table.insertRow();
        for (var j = 0; j < 5; j++) {
            var cell = row.insertCell();
            var char = allowRepeats ? GetRandomCharacter() : GetRandomUnusedCharacter(usedChars);
            usedChars.push(char);
            cell.innerHTML = char.ToHtml();
            cell.classList.add("default");
            cell.onclick = OnClickCell;
        }
    }
    container.appendChild(table);
    ToggleNames();
}
function OnClickCell() {
    var classes = ["green", "red", "blue", "yellow", "default"];
    for (var classIndex = 0; classIndex < classes.length; classIndex++) {
        var className = classes[classIndex];
        if (this.classList.contains(className)) {
            this.classList.remove(className);
            var nextClass = classes[(classIndex + 1) % classes.length];
            this.classList.add(nextClass);
            return;
        }
    }
    this.classList.add(classes[0]);
}
function GetDailySeed() {
    try {
        var req = new XMLHttpRequest();
        req.open("GET", window.location.href, false);
        req.send();
        var date = new Date(req.getResponseHeader("Date"));
        var dateNum = +(date.getFullYear() + "" + date.getMonth() + "" + date.getDate());
        return Math.floor(1000000 * Math.abs(Math.sin(dateNum)));
    }
    catch (e) {
        var button = document.getElementById("todayButton");
        button.innerHTML = "Server unavailable :(";
        button.classList.add("disabled");
    }
}
function ToggleNames() {
    var nameElements = Array.from(document.getElementsByClassName("charName"));
    if (document.getElementsByClassName("charName")[0].style.display) {
        nameElements.map(function (x) { return x.style.display = ""; });
    }
    else {
        nameElements.map(function (x) { return x.style.display = "none"; });
    }
}
window.onload = OnLoad;
//# sourceMappingURL=app.js.map