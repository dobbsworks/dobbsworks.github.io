var viewWidth = 800;
var viewHeight = 600;
window.onload = InitializeGameEngine;

var gameViewContext;
var sprites = [];
var particleEffects = [];
var particleEffectGenerators = [];
var meters = [];
var mouseInfo = { x: 0, y: 0, pressed: false, oldX: 0, oldY: 0, leftClicked: false, rightClicked: false };
var mainLoop = { interval: null, milliseconds: 19 };

var player;

function InitializeGameEngine() {
    initializeGraphicSheets();
    var gameView = document.getElementById('gameView');

    //gameView.addEventListener("mousedown", onMouseDown, false);
    //gameView.addEventListener("mouseup", onMouseUp, false);
    //gameView.addEventListener("mousemove", onMouseMove, false);
    //gameView.addEventListener("touchstart", onMouseDown, false);
    //gameView.addEventListener("touchmove", onMouseMove, false);
    //gameView.addEventListener("touchend", onMouseUp, false);
    gameView.oncontextmenu = function (e) {
        e.preventDefault();
    };

    gameView.onmousedown = function (e) {
        e = e || window.event;
        UpdateMousePosition(e);
        mouseInfo.pressed = true;
        if (e.button == 0) mouseInfo.leftClicked = true;
        if (e.button == 2) mouseInfo.rightClicked = true;
    };

    gameView.onmousemove = function (e) {
        e = e || window.event;
        UpdateMousePosition(e);
    };

    gameView.onmouseup = function (e) {
        mouseInfo.pressed = false;
    };

    gameView.onmouseout = function (e) {
        mouseInfo.pressed = false;
    };

    gameView.ontouchstart = function (e) {
        e = e || window.event;
        e.preventDefault();
        UpdateMousePosition(e);
        mouseInfo.pressed = true;
        mouseInfo.leftClicked = true;
    };

    gameView.ontouchmove = function (e) {
        e = e || window.event;
        e.preventDefault();
        UpdateMousePosition(e);
        mouseInfo.pressed = true;
    };

    gameView.ontouchend = function (e) {
        e = e || window.event;
        e.preventDefault();
        UpdateMousePosition(e);
        mouseInfo.pressed = false;
    }

    gameViewContext = gameView.getContext('2d');
    gameViewContext.imageSmoothingEnabled = false;

    mainLoop.interval = setInterval(pulse, mainLoop.milliseconds);

    var itemPanel = document.getElementById("items");
    for (var i = 0; i < itemTypes.length; i++) {
        var itemButton = document.createElement("div");
        itemButton.innerHTML = itemTypes[i].name;
        itemButton.dataset.index = i;
        itemButton.className = "itemButton";
        if (i == 0) itemButton.className = "itemButton activeItemType";
        itemButton.onclick = onItemButtonClick;
        itemPanel.appendChild(itemButton);
    }


    var freemoneyContainer = document.getElementById("FreeMoneyContainer");
    freemoneyContainer.onclick = OnClickFreeMoney;
}


function onItemButtonClick() {
    var allItemButtons = document.getElementsByClassName("itemButton");
    for (var i = 0; i < allItemButtons.length; i++) allItemButtons[i].className = "itemButton";
    this.className = "itemButton activeItemType";
}



var money = 10;


function pulse() {
    for (var i = 0; i < itemTypes.length; i++) {
        if (itemTypes[i].hotkey && keyboardState.keyState[itemTypes[i].hotkey]) {
            onItemButtonClick.apply(document.getElementsByClassName("itemButton")[i]);
        }
    }
    if (mouseInfo.leftClicked || mouseInfo.rightClicked) {
        for (var i = 0; i < farm.length; i++) {
            var farmCell = farm[i];
            if (mouseInfo.x >= farmCell.xPixel && mouseInfo.x < farmCell.xPixel + farmCell.width &&
                mouseInfo.y >= farmCell.yPixel && mouseInfo.y < farmCell.yPixel + farmCell.height) {
                if (mouseInfo.leftClicked) OnLeftClickCell(farmCell);
                if (mouseInfo.rightClicked) OnRightClickCell(farmCell);
            }
        }
    }

    for (var i = 0; i < farm.length; i++) {
        farm[i].update();
    }

    MainDrawLoop();
    cycleMouseInfo();
}

function cycleMouseInfo() {
    mouseInfo.oldX = mouseInfo.x;
    mouseInfo.oldY = mouseInfo.y;
    mouseInfo.leftClicked = false;
    mouseInfo.rightClicked = false;
}



var farm = [];
var farmRows = 10;
var farmCols = 10;
for (var j = 0; j < farmRows; j++) {
    for (var i = 0; i < farmCols; i++) {
        var farmCell = new FarmCell(i, j);
        farm.push(farmCell);
    }
}



//function OnLeftClickCell(cell) {
//    if (cell.sprouts.length !== 0) {
//        cell.grow(2);
//    }
//}


function OnClickFreeMoney() {
    money += 1;
}


function OnLeftClickCell(cell) {
    var selectedItemButtons = document.getElementsByClassName("activeItemType");
    if (selectedItemButtons.length === 0) return;

    var itemIndex = selectedItemButtons[0].dataset.index;

    var itemType = itemTypes[itemIndex];

    if (itemType.cost > money) return;
    if (!itemType.canPlace(cell)) return;
    money -= itemType.cost;
    itemType.place(cell);
}



function FarmCell(x, y) {
    this.xIndex = x;
    this.yIndex = y;
    this.xPixel = viewWidth / farmCols * x;
    this.yPixel = viewHeight / farmRows * y;
    this.width = viewWidth / farmCols;
    this.height = viewHeight / farmRows;
    this.color = new Color(96 + 12 * Math.random(), 48 + 6 * Math.random(), 24 + 3 * Math.random(), 1.0);
    this.borderColor = new Color(84, 42, 21, 1.0);

    this.growth = 0;

    this.counter = 0;
    this.sprouts = [];

    this.addSprouts = function () {
        for (var i = 1; i < 7; i++) {
            for (var j = 1; j < 7; j++) {
                this.sprouts.push({
                    x: (this.width / 8) * (Math.random() + i),
                    y: (this.height / 8) * (Math.random() + j),
                    height: 4,
                    lean: 0
                });
            }
        }
    }

    this.grow = function (amount) {
        this.growth += amount;
        for (var i = 0; i < this.sprouts.length; i++) {
            this.sprouts[i].height += amount;
        }
        if (this.growth >= 30) {
            this.growth = 0;
            this.sprouts = [];
            money += 16;
        }
    }

    this.update = function () {
        this.counter++;
        if (this.sprouts.length > 0) this.grow(0.02);
    }

    this.draw = function () {
        gameViewContext.lineWidth = 3;
        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.fillRect(this.xPixel, this.yPixel, this.width, this.height);
        gameViewContext.strokeRect(this.xPixel, this.yPixel, this.width, this.height);

        gameViewContext.strokeStyle = "green";
        gameViewContext.lineWidth = 2;
        for (var i = 0; i < this.sprouts.length; i++) {
            var sprout = this.sprouts[i];
            DrawLine(this.xPixel + sprout.x, this.yPixel + sprout.y, this.xPixel + sprout.x + sprout.lean, this.yPixel + sprout.y - sprout.height);
        }
    }
}


function DrawLine(x1, y1, x2, y2) {
    gameViewContext.beginPath();
    gameViewContext.moveTo(x1, y1);
    gameViewContext.lineTo(x2, y2);
    gameViewContext.stroke();
}



function MainDrawLoop() {
    gameViewContext.clearRect(0, 0, viewWidth, viewHeight);
    for (var i = 0; i < farm.length; i++) {
        farm[i].draw();
    }
    var moneyDisplay = document.getElementById("money");
    moneyDisplay.innerHTML = "$" + money;
}



Array.prototype.rand = function () {
    return this[Math.floor(Math.random() * this.length)];
};

