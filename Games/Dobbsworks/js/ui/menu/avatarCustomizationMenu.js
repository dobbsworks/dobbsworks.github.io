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
var AvatarLayerElement = /** @class */ (function () {
    function AvatarLayerElement(id, imageSource) {
        this.id = id;
        this.imageSource = imageSource;
    }
    return AvatarLayerElement;
}());
var AvatarPanel = /** @class */ (function (_super) {
    __extends(AvatarPanel, _super);
    function AvatarPanel(avatarCode, scale) {
        if (scale === void 0) { scale = 2; }
        var _this = _super.call(this, 0, 0, 20 * scale, 20 * scale) || this;
        _this.margin = 0;
        _this.backColor = "#F00D";
        if (avatarCode) {
            var segments = avatarCode.split(",");
            for (var segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
                var codeSegment = segments[segmentIndex];
                var id = Utility.IntFromB64(codeSegment);
                var func = [AvatarCustomizationMenu.GetBackImage, AvatarCustomizationMenu.GetFocusImage, AvatarCustomizationMenu.GetFrameImage][segmentIndex];
                var imageTile = func(id);
                var imageFromTile = new ImageFromTile(0, 0, 20 * scale, 20 * scale, imageTile);
                imageFromTile.zoom = scale;
                _this.AddChild(imageFromTile);
            }
        }
        return _this;
    }
    return AvatarPanel;
}(Panel));
var AvatarCustomizationMenu = /** @class */ (function (_super) {
    __extends(AvatarCustomizationMenu, _super);
    function AvatarCustomizationMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopsMapUpdate = true;
        _this.backgroundColor = "#022";
        _this.unlockedElements = "";
        _this.availableFocusElements = [];
        _this.availableBackElements = [];
        _this.availableFrameElements = [];
        return _this;
    }
    AvatarCustomizationMenu.prototype.CreateElements = function () {
        var _this = this;
        DataService.GetUserData().then(function (userData) {
            _this.usernameTextElement.text = userData.username;
            AvatarCustomizationMenu.username = userData.username;
            AvatarCustomizationMenu.ImportFromAvatarString(userData.avatar);
            _this.unlockedElements = userData.unlocks;
            _this.RefreshAvailableElements();
        });
        var ret = [];
        this.selectionPanels = new Panel(0, 0, 350, 520);
        var mainPanel = new Panel(20, 20, 900, 520);
        mainPanel.AddChild(this.selectionPanels);
        var profilePanel = new Panel(0, 0, 500, 170);
        profilePanel.margin = 0;
        profilePanel.backColor = "#1138";
        var namePanel = new Panel(0, 0, 330, 80);
        this.usernameTextElement = new UIText(0, 0, "", 28, "white");
        this.usernameTextElement.textAlign = "left";
        this.usernameTextElement.yOffset = 32;
        this.usernameTextElement.xOffset = 4;
        var nameEditButton = new Button(0, 0, 48, 48);
        var editImage = new ImageFromTile(0, 0, 36, 36, tiles["editor"][4][0]);
        editImage.zoom = 3;
        nameEditButton.AddChild(editImage);
        nameEditButton.onClickEvents.push(function () {
            UIDialog.SmallPrompt("What would you like your Dabble Worlds name to be?", "Done", 16, function (newName) {
                if (newName) {
                    AvatarCustomizationMenu.username = newName;
                    _this.usernameTextElement.text = newName;
                }
            }, UISmallPrompt.SimpleCharacters);
        });
        namePanel.AddChild(this.usernameTextElement);
        namePanel.AddChild(nameEditButton);
        var medalPanel = new Panel(0, 0, 330, 80);
        var rightPanel = new Panel(0, 0, 330, 170);
        rightPanel.layout = "vertical";
        rightPanel.margin = 0;
        rightPanel.AddChild(namePanel);
        rightPanel.AddChild(medalPanel);
        this.previewPanel = new Panel(0, 0, 170, 170);
        profilePanel.AddChild(this.previewPanel);
        profilePanel.AddChild(rightPanel);
        var rightSide = new Panel(0, 0, 500, 500);
        rightSide.margin = 0;
        rightSide.layout = "vertical";
        rightSide.AddChild(profilePanel);
        mainPanel.AddChild(rightSide);
        var buttons = new Panel(0, 0, 500, 60);
        var cancelButton = new Button(0, 0, 240, 60);
        var cancelText = new UIText(0, 0, "Cancel", 24, "white");
        cancelText.yOffset = 34;
        cancelButton.AddChild(new Spacer(0, 0, 0, 0));
        cancelButton.AddChild(cancelText);
        cancelButton.AddChild(new Spacer(0, 0, 0, 0));
        buttons.AddChild(cancelButton);
        cancelButton.onClickEvents.push(function () {
            MenuHandler.GoBack();
        });
        var saveButton = new Button(0, 0, 240, 60);
        var saveText = new UIText(0, 0, "Save Changes", 24, "white");
        saveText.yOffset = 34;
        saveButton.AddChild(new Spacer(0, 0, 0, 0));
        saveButton.AddChild(saveText);
        saveButton.AddChild(new Spacer(0, 0, 0, 0));
        saveButton.onClickEvents.push(function () {
            if (AvatarCustomizationMenu.username) {
                var newAvatarString = AvatarCustomizationMenu.ExportAvatarString();
                DataService.UpdateNameAndAvatar(newAvatarString, AvatarCustomizationMenu.username);
                MenuHandler.GoBack();
            }
            else {
                UIDialog.Alert("Something went wrong saving the changes, please try again later!", "OK");
            }
        });
        buttons.AddChild(saveButton);
        rightSide.AddChild(buttons);
        ret.push(mainPanel);
        return ret;
    };
    AvatarCustomizationMenu.ImportFromAvatarString = function (avatarString) {
        if (avatarString) {
            for (var i = 0; i < 3; i++) {
                AvatarCustomizationMenu.selectedElementIndeces[i] = Utility.IntFromB64(avatarString.split(",")[i]);
            }
        }
    };
    AvatarCustomizationMenu.ExportAvatarString = function () {
        return AvatarCustomizationMenu.selectedElementIndeces.map(function (a) {
            return Utility.toTwoDigitB64(a);
        }).join(",");
    };
    AvatarCustomizationMenu.prototype.RefreshAvailableElements = function () {
        var _this = this;
        this.availableFocusElements = this.GetAllFocusElements().filter(function (a) { return _this.unlockedElements.split(",").indexOf("1" + Utility.toTwoDigitB64(a.id)) > -1; });
        this.availableBackElements = this.GetAllBackElements().filter(function (a) { return _this.unlockedElements.split(",").indexOf("0" + Utility.toTwoDigitB64(a.id)) > -1; });
        this.availableFrameElements = this.GetAllFrameElements().filter(function (a) { return _this.unlockedElements.split(",").indexOf("2" + Utility.toTwoDigitB64(a.id)) > -1; });
        var panel1 = this.GetSelectionPanel(this.availableFocusElements, 0, 1);
        var panel2 = this.GetSelectionPanel(this.availableBackElements, 0, 0);
        var panel3 = this.GetSelectionPanel(this.availableFrameElements, 0, 2);
        this.selectionPanels.children = [];
        this.selectionPanels.AddChild(panel1);
        this.selectionPanels.AddChild(panel2);
        this.selectionPanels.AddChild(panel3);
        this.UpdatePreview();
    };
    AvatarCustomizationMenu.prototype.UpdatePreview = function () {
        var back = this.availableBackElements.find(function (a) { return a.id === AvatarCustomizationMenu.selectedElementIndeces[0]; });
        var focus = this.availableFocusElements.find(function (a) { return a.id === AvatarCustomizationMenu.selectedElementIndeces[1]; });
        var frame = this.availableFrameElements.find(function (a) { return a.id === AvatarCustomizationMenu.selectedElementIndeces[2]; });
        this.previewPanel.children = [];
        for (var _i = 0, _a = [back, focus, frame]; _i < _a.length; _i++) {
            var customization = _a[_i];
            if (customization) {
                var imageTile = new ImageFromTile(0, 0, 160, 160, customization.imageSource);
                imageTile.zoom = 8;
                this.previewPanel.AddChild(imageTile);
            }
        }
    };
    AvatarCustomizationMenu.prototype.GetSelectionPanel = function (contents, selectedIndex, layerNum) {
        var _this = this;
        var newPanel = new Panel(0, 0, 100, 500);
        newPanel.backColor = "#0044";
        newPanel.layout = "vertical";
        var _loop_1 = function (i) {
            var id = contents[i].id;
            var button = new AvatarCustomizationButton(contents[i].imageSource, layerNum, id);
            button.radioKey = "avatar" + layerNum;
            button.onClickEvents.push(function () {
                button.isSelected = true;
                AvatarCustomizationMenu.selectedElementIndeces[layerNum] = id;
                _this.UpdatePreview();
            });
            if (i < 5) {
                newPanel.AddChild(button);
            }
            else {
                newPanel.scrollableChildrenDown.push(button);
            }
        };
        for (var i = 0; i < contents.length; i++) {
            _loop_1(i);
        }
        return newPanel;
    };
    AvatarCustomizationMenu.prototype.GetAllFocusElements = function () {
        var ret = [];
        for (var i = 0; i < 96; i++) {
            ret.push(new AvatarLayerElement(i, AvatarCustomizationMenu.GetFocusImage(i)));
        }
        return ret;
    };
    AvatarCustomizationMenu.prototype.GetAllFrameElements = function () {
        var ret = [];
        for (var i = 0; i < 48; i++) {
            ret.push(new AvatarLayerElement(i, AvatarCustomizationMenu.GetFrameImage(i)));
        }
        return ret;
    };
    AvatarCustomizationMenu.prototype.GetAllBackElements = function () {
        var ret = [];
        for (var i = 0; i < 48; i++) {
            ret.push(new AvatarLayerElement(i, AvatarCustomizationMenu.GetBackImage(i)));
        }
        return ret;
    };
    AvatarCustomizationMenu.GetImageFrom3CharCode = function (code) {
        if (code.length != 3)
            throw "Invalid avatar code [" + code + "]";
        var segmentIndex = +(code[0]);
        var func = [AvatarCustomizationMenu.GetBackImage, AvatarCustomizationMenu.GetFocusImage, AvatarCustomizationMenu.GetFrameImage][segmentIndex];
        var id = Utility.IntFromB64(code.substring(1));
        return func(id);
    };
    AvatarCustomizationMenu.GetFocusImage = function (id) {
        return tiles["avatars"][id % 16][Math.floor(id / 16)];
    };
    AvatarCustomizationMenu.GetFrameImage = function (id) {
        id += 16 * 9;
        return tiles["avatars"][id % 16][Math.floor(id / 16)];
    };
    AvatarCustomizationMenu.GetBackImage = function (id) {
        id += 16 * 6;
        return tiles["avatars"][id % 16][Math.floor(id / 16)];
    };
    AvatarCustomizationMenu.selectedElementIndeces = [0, 0, 0];
    AvatarCustomizationMenu.username = "";
    return AvatarCustomizationMenu;
}(Menu));
var AvatarCustomizationButton = /** @class */ (function (_super) {
    __extends(AvatarCustomizationButton, _super);
    function AvatarCustomizationButton(imageTile, layer, id) {
        var _this = _super.call(this, 0, 0, 90, 90) || this;
        _this.layer = layer;
        _this.id = id;
        _this.AddChild(new ImageFromTile(0, 0, 80, 80, imageTile));
        return _this;
    }
    AvatarCustomizationButton.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.isSelected = AvatarCustomizationMenu.selectedElementIndeces[this.layer] === this.id;
        this.borderColor = this.isSelected ? "#2F2E" : "#444E";
    };
    return AvatarCustomizationButton;
}(Button));
