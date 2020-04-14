
var menus = [];

function GetCurrentMenu() {
    return menuStack.last();
}

function MenuBase(width, height, elements) {
    this.width = width;
    this.height = height;
    this.elements = elements;
    this.hideBackPanel = false;
    this.anchorType = anchorType.center;
    this.menuContainer = document.getElementById("MenuContainer");
    this.menuElement = document.createElement('div');
    if (this.width) this.menuElement.style.width = this.width + 'px';
    if (this.height) this.menuElement.style.height = this.height + 'px';
    this.refreshPosition = function () {
        var width = this.width ? this.width : this.menuElement.offsetWidth;
        var height = this.height ? this.height : this.menuElement.offsetHeight;
        if (this.anchorType.sides.indexOf('left') > -1)
            this.menuElement.style.left = '0px';
        else if (this.anchorType.sides.indexOf('right') > -1)
            this.menuElement.style.right = '0px';
        else
            this.menuElement.style.left = ((viewWidth - width) / 2) + 'px';

        if (this.anchorType.sides.indexOf('top') > -1)
            this.menuElement.style.top = '0px';
        else if (this.anchorType.sides.indexOf('bottom') > -1)
            this.menuElement.style.bottom = '0px';
        else
            this.menuElement.style.top = ((viewHeight - height) / 2) + 'px';
    }
    this.setPosition = function (newAnchorType) {
        this.anchorType = newAnchorType;
        this.refreshPosition();
    }
    this.display = function () {
        if (menus.indexOf(this) == -1) {
            menus.push(this);
            var menuElement = document.createElement('div');
            if (this.hideBackPanel) {
                this.menuElement.classList.add('menu-no-back');
            } else {
                this.menuElement.classList.add('menu');
            }
            for (var i = 0; i < this.elements.length; i++) {
                var node = this.elements[i].toNode(this);
                this.menuElement.appendChild(node);
            }
            this.menuContainer.appendChild(this.menuElement);
        }
        this.menuElement.style.opacity = '1.0';
        if (this.id) {
            this.menuElement.id = this.id;
        }
        this.refreshPosition();
    }
    this.hide = function () {
        this.menuElement.style.opacity = '0';
    }
    this.disable = function (permanent) {
        // Use when another menu goes active to prevent interaction with previous menu
        //this.menuElement.style.opacity = '0.3';
        var nodes = this.menuElement.getElementsByTagName('*');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].disabled = true;
            nodes[i].onclickcache = nodes[i].onclick;
            nodes[i].onclick = null;
        }
    }
    this.enable = function () {
        this.menuElement.style.opacity = '1.0';
        var nodes = this.menuElement.getElementsByTagName('*');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].disabled = false;
            if (nodes[i].onclickcache) nodes[i].onclick = nodes[i].onclickcache;
        }
    }
    this.close = function () {
        this.disable();
        if (this.parent) this.parent.enable();
        this.fadeOut();
    }
    this.fadeOut = function () {
        if (this.menuElement.style.opacity == '0' && this.opacity === undefined) {
            this.delete();
        } else {
            if (this.opacity === undefined) this.opacity = 1.0;
            this.opacity -= 0.05;
            var me = this;
            if (this.opacity > 0) {
                this.menuElement.style.opacity = this.opacity;
                setTimeout(function () { me.fadeOut() }, 25);
            } else {
                this.delete();
            }
        }
    }
    this.delete = function () {
        this.menuContainer.removeChild(this.menuElement);
        menus.splice(menus.indexOf(this), 1);
    }
}


function MenuTitle(text) {
    this.text = text;
    this.toNode = function (menu) {
        var h = document.createElement("H2");
        var t = document.createTextNode(this.text);
        h.appendChild(t);
        return h;
    }
}


function MenuText(text) {
    this.text = text;
    this.toNode = function (menu) {
        var h = document.createElement("div");
        var t = document.createTextNode(this.text);
        h.appendChild(t);
        return h;
    }
}


function MenuUnorderedList(items) {
    this.items = items;
    this.toNode = function (menu) {
        var el = document.createElement("ul");
        for (var i = 0; i < this.items.length; i++) {
            var t = document.createTextNode(this.items[i]);
            var li = document.createElement("li");
            li.appendChild(t);
            el.appendChild(li);
        }
        return el;
    }
}


function MenuTextInput(text, readOnly) {
    this.text = text;
    this.readOnly = readOnly;
    this.toNode = function (menu) {
        var input = document.createElement("input");
        input.type = "text";
        input.readOnly = this.readOnly;
        input.value = this.text;
        input.classList.add("menuTextInput");
        input.style.width = (menu.width - 44) + 'px';
        return input;
    }
}

function MenuTextArea(text, readOnly) {
    this.text = text;
    this.readOnly = readOnly;
    this.toNode = function (menu) {
        var input = document.createElement("textarea");
        input.readOnly = this.readOnly;
        input.textContent = this.text;
        input.style.width = (menu.width - 44) + 'px';
        return input;
    }
}


function MenuActionButton(text, func) {
    this.text = text;
    this.action = func;
    this.toNode = function (menu) {
        var div = document.createElement("DIV");
        var t = document.createTextNode(this.text);
        div.appendChild(t);
        div.classList.add('menuButton');
        div.onclick = this.action;
        return div;
    }
}


function MenuActionButtonSmall(text, func) {
    this.text = text;
    this.action = func;
    this.toNode = function (menu) {
        var div = document.createElement("DIV");
        var t = document.createTextNode(this.text);
        div.appendChild(t);
        div.classList.add('menuButtonSmall');
        div.onclick = this.action;
        return div;
    }
}


function MenuImage(image) {
    this.toNode = function (menu) {
        var img = document.createElement("img");
        img.src = image.src;
        img.classList.add('image-' + image.id);
        return img;
    }
}


function MenuFancyText(text) {
    this.toNode = function (menu) {
        var img = document.createElement("img");
        img.src = WriteFancyTextToCanvas(text);
        img.classList.add('image-text');
        return img;
    }
}


function MenuTable(elements) {
    // elements is a list of lists corresponding to a 2d array of nodes
    this.elements = elements;
    this.toNode = function (menu) {
        var table = document.createElement("table");
        for (var i = 0; i < elements.length; i++) {
            var row = document.createElement("tr");
            for (var j = 0; j < elements[i].length; j++) {
                var cell = document.createElement("td");
                cell.appendChild(elements[i][j]);
                row.appendChild(cell);
            }
            table.appendChild(row);            
        }
        return table;
    }
}


function GetMenuObjectFromElement(element) {
    for (var i = 0; i < menus.length; i++) {
        var el = element;
        while (el && el.classList && !el.classList.contains('menu')) el = el.parentNode;
            if (menus[i].menuElement == el)
                return menus[i];
    }
}

function CloseAllMenus() {
    for (var i = menus.length-1; i >= 0; i--) {
        menus[i].close();
    }
}




function MainMenu() {
    var gameLogo = new MenuFancyText('Gerbil Tales!');
    editorSprites = [];
    sprites = [];

    var levelSelect = new MenuActionButton("Play", function () {
        GetMenuObjectFromElement(this).close();
        var levelMenu = new LevelSelectMenu();
        levelMenu.display();
    });
    var startLevelEditor = new MenuActionButton("Level Editor", function () {
        var editMenu = new EditMenu();
        editMenu.display();
        var toolMenu = new ToolMenu();
        toolMenu.display();
        GetMenuObjectFromElement(this).close();
        SwitchToEditMode();
        camera.x = 0;
        camera.y = 0;
    });
    var changelog = new MenuActionButtonSmall("Version " + version, function () {
        GetMenuObjectFromElement(this).close();
        var changelogMenu = new ChangeLogMenu();
        changelogMenu.display();
    });
    var survey = new MenuActionButtonSmall("Suggest the next feature!", function () {
        window.open("https://docs.google.com/forms/d/1mdYA7JvVHHST7_a0X2rHhvfoRM30ouJDBsUItzSSQto/viewform");
    });
    var logo = new MenuImage(document.getElementById('StudioLogo')).toNode();
    logo.onclick = function () {
        window.open("http://www.thedobbsworks.com/");
    }
    logo.style.float = 'left';
    logo.style.margin = '20px';

    var subredditButton = new MenuActionButtonSmall("Visit the Subreddit!", function () {
        window.open("https://www.reddit.com/r/gerbiltales/");
    });

    MenuBase.call(this, 600, null, [
        gameLogo,
        levelSelect,
        startLevelEditor,
        new MenuTable([[logo, new MenuTable([[survey.toNode()], [subredditButton.toNode()], [changelog.toNode()]]).toNode()]])
    ]);
}
MainMenu.prototype = new MenuBase();
MainMenu.prototype.constructor = MainMenu;



function ChangeLogMenu() {
    var backToMainMenu = new MenuActionButton("Back to Main Menu", function () {
        var mainMenu = new MainMenu();
        mainMenu.display();
        GetMenuObjectFromElement(this).close();
    });

    var changes = [];
    changes.push(new MenuFancyText('Change Log'));
    for (var i = 0; i < versionHistory.length; i++) {
        changes.push(new MenuTitle('Version ' + versionHistory[i].v));
        changes.push(new MenuUnorderedList(versionHistory[i].changes));
    }
    changes.push(backToMainMenu);

    MenuBase.call(this, 400, null, changes);
}
ChangeLogMenu.prototype = new MenuBase();
ChangeLogMenu.prototype.constructor = ChangeLogMenu;



function ToolMenu() {
    var tools = [];
    var toolRow = [];
    for (var i = 0; i < editorObjectTypes.length; i++) {
        var button = new MenuActionButtonSmall(
            editorObjectTypes[i].name,
            function () { InsertEditorObject(this.getAttribute("editorObjectIndex")); }
        );
        var buttonNode = button.toNode();
        buttonNode.setAttribute("editorObjectIndex", i);
        toolRow.push(buttonNode);
        if (toolRow.length >= 11) {
            tools.push(toolRow);
            toolRow = [];
        }
    }
    tools.push(toolRow);

    MenuBase.call(this, null, null, [
        new MenuTable(tools)
    ]);
    this.anchorType = anchorType.topleft;
}
ToolMenu.prototype = new MenuBase();
ToolMenu.prototype.constructor = ToolMenu;



var editMenu = null;
var editButton = null;
var playButton = null;
var exportButton = null;
var importButton = null;
var cameraButton = null;
function EditMenu() {
    var options = [];

    var button1 = new MenuActionButtonSmall("Switch to EDIT Mode", SwitchToEditMode);
    editButton = button1.toNode();
    editButton.classList.add('hidden');
    options.push(editButton);

    var button2 = new MenuActionButtonSmall("Switch to PLAY Mode", function () { SwitchToPlayMode(true) });
    playButton = button2.toNode();
    options.push(playButton);

    var button3 = new MenuActionButtonSmall("Export Level", function () {
        var exportMenu = new LevelExportMenu();
        exportMenu.display();
    });
    exportButton = button3.toNode();
    options.push(exportButton);

    var button4 = new MenuActionButtonSmall("Import Level", function () {
        var importMenu = new EditorImportMenu();
        importMenu.display();        
    });
    importButton = button4.toNode();
    options.push(importButton);

    var button5 = new MenuActionButtonSmall("Back to Main Menu", function () {
        if (confirm("Are you sure? You will lose any changes you have made.")) {
            GetMenuObjectFromElement(this).close();
            for (var i = 0; i < menus.length; i++) if (menus[i] instanceof ToolMenu) menus[i].close();
            var mainMenu = new MainMenu();
            SwitchToPlayMode(true);
            sprites = [];
            mainMenu.display();
        }
    });
    options.push(button5.toNode());

    var button6 = new MenuActionButtonSmall("Center Camera", function () { camera.x = 0; camera.y = 0; });
    cameraButton = button6.toNode();
    options.push(cameraButton);

    MenuBase.call(this, null, null, [
        new MenuTable([options])
    ]);
    this.anchorType = anchorType.bottomleft;
}
EditMenu.prototype = new MenuBase();
EditMenu.prototype.constructor = EditMenu;



function LevelSelectMenu() {
    var title = new MenuFancyText('Levels');
    var backToMainMenu = new MenuActionButton("Back to Main Menu", function () {
        var mainMenu = new MainMenu();
        mainMenu.display();
        GetMenuObjectFromElement(this).close();
    });
    var playCustomButton = new MenuActionButton("Play a Custom Level", function () {
        var importMenu = new LevelImportMenu();
        importMenu.display();
        GetMenuObjectFromElement(this).close();
    });

    var options = [title];

    var selectableLevels = [];
    var levelRow = [];
    for (var i = 0; i < levels.length; i++) {
        var level = levels[i];
        levelRow.push(GetLevelPlayButton(i).toNode());
        if (levelRow.length >= 5) {
            selectableLevels.push(levelRow);
            levelRow = [];
        }
    }
    selectableLevels.push(levelRow);
    options.push(new MenuTable(selectableLevels));
    options.push(playCustomButton);
    options.push(backToMainMenu);

    MenuBase.call(this, 500, null, options);
}
LevelSelectMenu.prototype = new MenuBase();
LevelSelectMenu.prototype.constructor = LevelSelectMenu;

function GetLevelPlayButton(levelIndex) {
    return new MenuActionButton("" + (levelIndex + 1).toString(), function () {
        var levelToPlay = new LevelBase(levels[levelIndex]);
        levelToPlay.LevelStartMenu();
        GetMenuObjectFromElement(this).close();
    })
}


function LevelImportMenu() {
    var title = new MenuFancyText('Custom Level');
    var backToMainMenu = new MenuActionButton("Back to Main Menu", function () {
        var mainMenu = new MainMenu();
        mainMenu.display();
        GetMenuObjectFromElement(this).close();
    });
    var text = new MenuText("Paste your level code below and click Play.");
    var textArea = new MenuTextArea('', false);
    var importButton = new MenuActionButton("Play", function () {
        var levelString = document.getElementsByTagName('textarea')[0].value;
        var levelObj = JSON.parse(levelString);
        var level = new LevelBase(levelObj)
        level.LevelStartMenu();
        GetMenuObjectFromElement(this).close();
    });

    MenuBase.call(this, 500, null, [
        title,
        text,
        textArea,
        importButton,
        backToMainMenu
    ]);
}
LevelImportMenu.prototype = new MenuBase();
LevelImportMenu.prototype.constructor = LevelImportMenu;


function EditorImportMenu() {
    var title = new MenuFancyText('Level Import');
    var cancelButton = new MenuActionButton("Cancel", function () {
        GetMenuObjectFromElement(this).close();
    });
    var text = new MenuText("Paste your level code below and click Import.");
    var textArea = new MenuTextArea('', false);
    var importButton = new MenuActionButton("Import", function () {
        var levelString = document.getElementsByTagName('textarea')[0].value;
        var levelObj = JSON.parse(levelString);
        LoadLevel(levelObj);
        GetMenuObjectFromElement(this).close();
    });

    MenuBase.call(this, 500, null, [
        title,
        text,
        textArea,
        importButton,
        cancelButton
    ]);
}
LevelImportMenu.prototype = new MenuBase();
LevelImportMenu.prototype.constructor = LevelImportMenu;


function LevelExportMenu() {
    var title = new MenuFancyText('Level Export');
    var cancelButton = new MenuActionButton("Cancel", function () {
        GetMenuObjectFromElement(this).close();
    });
    var textInput = new MenuTextInput('Level Name', false);
    var exportButton = new MenuActionButton("Export", function () {
        var levelName = document.getElementsByClassName('menuTextInput')[0].value;
        var levelString = ExportLevel(levelName);
        GetMenuObjectFromElement(this).close();
        var exportMenu = new LevelExportResultMenu(levelString);
        exportMenu.display();
    });

    MenuBase.call(this, 500, null, [
        title,
        textInput,
        exportButton,
        cancelButton
    ]);
}
LevelExportMenu.prototype = new MenuBase();
LevelExportMenu.prototype.constructor = LevelExportMenu;


function LevelExportResultMenu(levelString) {
    var title = new MenuFancyText('Level Export');
    var text = new MenuText("Here is your level code.");
    var cancelButton = new MenuActionButton("Done", function () {
        GetMenuObjectFromElement(this).close();
    });
    var result = new MenuTextArea(levelString, true);

    MenuBase.call(this, 500, null, [
        title,
        text,
        result,
        cancelButton
    ]);
}
LevelExportResultMenu.prototype = new MenuBase();
LevelExportResultMenu.prototype.constructor = LevelExportResultMenu;



function EditableMenu() {
    this.id = 'editables';
    MenuBase.call(this, null, null, []);
    this.anchorType = anchorType.bottomright;
}
EditableMenu.prototype = new MenuBase();
EditableMenu.prototype.constructor = EditableMenu;



function WriteFancyTextToCanvas(text) {
    var canvas = document.getElementById('textDraw');
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.font = '40pt Candy Shop Black';
    var textWidth = context.measureText(text).width;
    var left = (canvas.width - textWidth) / 2;

    //canvas.width = textWidth + 20;

    context.lineWidth = 14;
    context.strokeStyle = 'rgb(177, 174, 89)';
    context.strokeText(text, left, 80);

    context.fillStyle = 'rgb(227, 225, 173)';
    context.fillText(text, left, 80);

    context.lineWidth = 2;
    context.strokeStyle = 'rgba(255, 255, 190, 0.75)';
    context.strokeText(text, left, 80);

    context.fill();
    context.stroke();
    return canvas.toDataURL("image/png");
}