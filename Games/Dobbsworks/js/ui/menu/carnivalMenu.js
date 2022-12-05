"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CarnivalMenu = /** @class */ (function (_super) {
    __extends(CarnivalMenu, _super);
    function CarnivalMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.backgroundColor = "#000";
        _this.timer = 0;
        return _this;
    }
    CarnivalMenu.prototype.CreateElements = function () {
        var _this = this;
        var ret = [];
        var imageContainer = new Panel(-5, -5, camera.canvas.width + 10, camera.canvas.height + 10);
        imageContainer.backColor = "#F000";
        ret.push(imageContainer);
        var bg = new ImageFromTile(0, 0, camera.canvas.width, camera.canvas.height, tiles["carnivalBack"][0][0]);
        bg.fixedPosition = true;
        bg.zoom = 1;
        imageContainer.AddChild(bg);
        var barker = new ImageFromTile(30, camera.canvas.height - 308, 498, 308, tiles["barker"][0][0]);
        barker.fixedPosition = true;
        barker.zoom = 1;
        imageContainer.AddChild(barker);
        var mog = new ImageFromTile(30 + 1000, camera.canvas.height - 308, 498, 308, tiles["mog"][0][0]);
        mog.fixedPosition = true;
        mog.zoom = 1;
        imageContainer.AddChild(mog);
        var mogTextContainer = new Panel(1080, 180, 400, 120);
        mogTextContainer.backColor = "#0008";
        mogTextContainer.layout = "vertical";
        ret.push(mogTextContainer);
        var mogTextString = Utility.RandFrom([
            "They let me have as many\\funnel cakes as I want. It's\\a pretty sweet gig!",
            "I'm gonna make you the best\\levels you've ever played.\\Maybe!",
            "Hello! I joined the circus,\\I think? I don't know!\\",
            "This circus is haunted! Not\\really, but Barker told me to\\say that for publicity! Neat!",
            "I'm a certified level maker!\\I made my own certificate,\\too! Talent!",
            "Where are they hiding all the\\elephants? Probably a pretty\\big hiding place!",
            "You're my first customer, so\\this will be a new experience\\for both of us!",
            "There's a lot of busted stuff\\here, but not me! I'm in\\perfect shape! A rectangle!",
            "So the ringmaster is a dog,\\but in my experience dogs are\\pretty capable mammals!",
            "Have you seen all these\\little pigs running around?\\Adorable!",
            "My brain is a neural net\\processor! Neat!\\"
        ]);
        var mogLines = mogTextString.split("\\");
        mogTextContainer.AddChild(new Spacer(0, 0, 0, 0));
        for (var _i = 0, mogLines_1 = mogLines; _i < mogLines_1.length; _i++) {
            var mogLine = mogLines_1[_i];
            var mogText = new UIText(80, 220, mogLine, 20, "white");
            mogText.xOffset = 20;
            mogText.yOffset = -10;
            mogText.textAlign = "left";
            mogText.font = "courier";
            mogTextContainer.AddChild(mogText);
        }
        this.titlePanel = new Panel(80, 50, 800, 90);
        this.titlePanel.backColor = "#fbf7bc";
        ret.push(this.titlePanel);
        var title = new UIText(0, 0, "BARKER'S CARNIVAL", 50, "blue");
        title.yOffset = 60;
        title.xOffset = this.titlePanel.width / 2;
        this.titlePanel.AddChild(title);
        // CONTAINERS
        var mainButtonPanel = new Panel(485, 180, 400, 360);
        mainButtonPanel.layout = "vertical";
        ret.push(mainButtonPanel);
        var marathonButtonPanel = new Panel(1485, 180, 400, 360);
        marathonButtonPanel.layout = "vertical";
        ret.push(marathonButtonPanel);
        var attractionButtonPanel = new Panel(1485, 180, 400, 360);
        attractionButtonPanel.layout = "vertical";
        ret.push(attractionButtonPanel);
        // MAIN PANEL
        var marathonMode = this.CreateButton("3-Ring Challenge");
        mainButtonPanel.AddChild(marathonMode);
        marathonMode.onClickEvents.push(function () {
            mainButtonPanel.targetX -= 1000;
            barker.x -= 1000;
            mog.x -= 1000;
            mogTextContainer.targetX -= 1000;
            marathonButtonPanel.targetX -= 1000;
        });
        var gamesOfSkill = this.CreateButton("Games of Skill");
        gamesOfSkill.normalBackColor = "#888";
        gamesOfSkill.mouseoverBackColor = "#888";
        mainButtonPanel.AddChild(gamesOfSkill);
        gamesOfSkill.onClickEvents.push(function () {
            audioHandler.PlaySound("error", true);
            //mainButtonPanel.targetX -= 1000;
            //attractionButtonPanel.targetX -= 1000;
        });
        var attractions = this.CreateButton("Attractions");
        attractions.normalBackColor = "#888";
        attractions.mouseoverBackColor = "#888";
        mainButtonPanel.AddChild(attractions);
        attractions.onClickEvents.push(function () {
            audioHandler.PlaySound("error", true);
            // mainButtonPanel.targetX -= 1000;
            // barker.x -= 1000;
            // attractionButtonPanel.targetX -= 1000;
        });
        var prizeCorner = this.CreateButton("Prize Corner");
        // prizeCorner.normalBackColor = "#888";
        // prizeCorner.mouseoverBackColor = "#888";
        mainButtonPanel.AddChild(prizeCorner);
        prizeCorner.onClickEvents.push(function () {
            //audioHandler.PlaySound("error", true);
            //mainButtonPanel.targetX -= 1000;
            //attractionButtonPanel.targetX -= 1000;
            MenuHandler.SubMenu(CarnivalPrizeMenu);
        });
        var backButton = this.CreateButton("Back");
        mainButtonPanel.AddChild(backButton);
        backButton.onClickEvents.push(function () {
            MenuHandler.GoBack();
            audioHandler.SetBackgroundMusic("intro");
        });
        // MARATHON PANEL
        LevelGeneratorDifficulty.List.forEach(function (diff) {
            var marathonModeButton = _this.CreateButton(diff.difficultyName);
            marathonButtonPanel.AddChild(marathonModeButton);
            marathonModeButton.onClickEvents.push(function () {
                levelGenerator = new LevelGenerator(diff);
                levelGenerator.LoadTestLevel();
                MenuHandler.SubMenu(BlankMenu);
                editorHandler.SwitchToPlayMode();
            });
        });
        var marathonBackButton = this.CreateButton("Back");
        marathonButtonPanel.AddChild(marathonBackButton);
        marathonBackButton.onClickEvents.push(function () {
            mainButtonPanel.targetX += 1000;
            barker.x += 1000;
            mog.x += 1000;
            mogTextContainer.targetX += 1000;
            marathonButtonPanel.targetX += 1000;
        });
        // ATTRACTIONS PANEL
        var attractionsBackButton = this.CreateButton("Back");
        attractionButtonPanel.AddChild(attractionsBackButton);
        attractionsBackButton.onClickEvents.push(function () {
            mainButtonPanel.targetX += 1000;
            barker.x += 1000;
            attractionButtonPanel.targetX += 1000;
        });
        return ret;
    };
    CarnivalMenu.prototype.CreateButton = function (text) {
        var button = new Button(0, 0, 400, 60);
        var buttonText = new UIText(0, 0, text, 30, "#00F");
        button.margin = 0;
        button.AddChild(buttonText);
        buttonText.xOffset = button.width / 2;
        buttonText.yOffset = 40;
        buttonText.textAlign = "center";
        button.normalBackColor = "#fbf7bcdd";
        button.mouseoverBackColor = "#ff0";
        button.borderColor = "#000";
        button.borderRadius = 9;
        return button;
    };
    CarnivalMenu.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.timer++;
    };
    CarnivalMenu.prototype.OnAfterDraw = function (camera) {
        var i = Math.floor(this.timer / 30);
        var circ = function (x, y) {
            camera.ctx.fillStyle = ["red", "lime", "blue"][i++ % 3];
            camera.ctx.beginPath();
            camera.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            camera.ctx.fill();
        };
        var x1 = this.titlePanel.x - 5;
        var x2 = this.titlePanel.x + this.titlePanel.width + 5;
        var y1 = this.titlePanel.y - 5;
        var y2 = this.titlePanel.y + this.titlePanel.height + 5;
        for (var x = x1; x <= x2; x += 10) {
            circ(x, y1);
        }
        for (var y = y1 + 10; y <= y2; y += 10) {
            circ(x2, y);
        }
        for (var x = x2 - 10; x >= x1; x -= 10) {
            circ(x, y2);
        }
        for (var y = y2 - 10; y >= y1 + 10; y -= 10) {
            circ(x1, y);
        }
    };
    return CarnivalMenu;
}(Menu));
