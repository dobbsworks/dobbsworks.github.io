var editorScale = 16;

function EditorBase(tileX, tileY, width, height) {

    this.editables = [];
    this.anchors = [];
    this.tileX = tileX;
    this.tileY = tileY;
    this.width = width;
    this.height = height;
    this.zIndex = 0;

    this.offset = 16;

    this.createSprite = function () { }

    this.highlightColor = new Color(255, 255, 200, 0.5);
    this.draw = function () {
        var sprite = this.createSprite();
        sprite.draw();
    }

    this.drawAnchors = function () {
        var sprite = this.createSprite();
        gameViewContext.setLineDash([5, 5]);
        gameViewContext.strokeStyle = new Color(255, 0, 0, 1.0).toString();
        gameViewContext.strokeRect(camera.convertX(sprite.getLeft()) - this.offset, camera.convertY(sprite.getTop()) - this.offset, sprite.width * camera.scale + this.offset * 2, sprite.height * camera.scale + this.offset * 2);
        gameViewContext.setLineDash([]);
        for (var i = 0; i < this.anchors.length; i++)
            this.anchors[i].draw(this);
    }

    this.edit = function () {
        var editableContainer = document.getElementById('editables');
        editableContainer.innerHTML = '';

        var objectName = this.name;
        var description = this.description;

        var nameObject = document.createElement("h3");
        nameObject.textContent = objectName;
        editableContainer.appendChild(nameObject);

        var descriptionObject = document.createElement("div");
        descriptionObject.textContent = description;
        descriptionObject.classList.add("editorDescription");
        editableContainer.appendChild(descriptionObject);

        var newTable = document.createElement("table");
        for (var i = 0; i < this.editables.length; i++) {
            var editable = this.editables[i];
            var newRow = newTable.insertRow(-1);
            editable.populateRow(newRow, this[editable.paramName]);
        }
        editableContainer.appendChild(newTable);

        var getOnClickForSpriteIndex = function (sprite) {
            var index = sprite.getIndex();
            return function () {
                SelectEditorObject(index);
            }
        }

        var createRelatedSpriteList = function (headerText, sprites) {
            if (sprites.length > 0) {
                var headerObject = document.createElement("h4");
                headerObject.textContent = headerText;
                editableContainer.appendChild(headerObject);
                for (var i = 0; i < sprites.length; i++) {
                    var linkObject = document.createElement("div");
                    linkObject.textContent = sprites[i].name + " " + sprites[i].getIndex();
                    linkObject.classList.add("editorLink");
                    linkObject.onclick = getOnClickForSpriteIndex(sprites[i]);
                    editableContainer.appendChild(linkObject);
                }
            }
        }

        createRelatedSpriteList("Referenced Sprites", this.getReferencedEditorSprites());
        createRelatedSpriteList("Referencing Sprites", this.getReferencingEditorSprites());
    }

    this.delete = function () {
        var editorSpriteIndex = editorSprites.indexOf(this);
        editorSprites.splice(editorSpriteIndex, 1);
        UpdateEditorPanel();
    }

    this.getIndex = function () {
        return editorSprites.indexOf(this);
    }

    this.getReferencedEditorSprites = function () {
        var ret = [];
        for (var j = 0; j < this.editables.length; j++) {
            var editable = this.editables[j];
            if (editable.paramType.isSpriteType) {
                if (this[editable.paramName]) ret.push(this[editable.paramName]);
            }
        }
        return ret.distinct();
    }

    this.getReferencingEditorSprites = function () {
        var ret = [];
        var myIndex = this.getIndex();
        for (var i = 0; i < editorSprites.length; i++) {
            if (i == myIndex) continue;
            var editorSprite = editorSprites[i];
            for (var j = 0; j < editorSprite.editables.length; j++) {
                var editable = editorSprite.editables[j];
                if (editable.paramType.isSpriteType) {
                    if (editorSprite[editable.paramName] == this) {
                        ret.push(editorSprite);
                    }
                }
            }
        }
        return ret.distinct();
    }
}

function Editable(paramName, paramType, validate) {
    this.paramName = paramName;
    this.paramType = paramType;
    this.validate = validate;
    this.getInputBox = function (value) {
        if (this.paramType == paramTypes.integer || this.paramType == paramTypes.decimal) {
            var inputBox = document.createElement("input");
            inputBox.setAttribute("id", this.paramName);
            inputBox.classList.add("editorBox");
            inputBox.setAttribute("type", this.paramType.inputType);
            inputBox.setAttribute("value", value);
            inputBox.setAttribute("onchange", this.paramType.onChange + '(this)');
            return inputBox;
        }
        if (this.paramType == paramTypes.string) {
            var inputBox = document.createElement("input");
            inputBox.setAttribute("id", this.paramName);
            inputBox.classList.add("editorBox");
            inputBox.setAttribute("type", this.paramType.inputType);
            inputBox.setAttribute("value", value);
            inputBox.setAttribute("onchange", this.paramType.onChange + '(this)');
            return inputBox;
        }
        if (this.paramType == paramTypes.boolean) {
            var checkbox = document.createElement("input");
            checkbox.setAttribute("id", this.paramName);
            checkbox.classList.add("editorBox");
            checkbox.setAttribute("type", this.paramType.inputType);
            checkbox.setAttribute("value", value);
            checkbox.checked = value;
            checkbox.setAttribute("onchange", this.paramType.onChange + '(this)');
            return checkbox;
        }
        if (this.paramType == paramTypes.direction) {
            var selectBox = document.createElement("select");
            selectBox.setAttribute("id", this.paramName);
            selectBox.classList.add("editorBox");
            selectBox.setAttribute("type", this.paramType.inputType);
            selectBox.setAttribute("value", value);
            selectBox.setAttribute("onchange", this.paramType.onChange + '(this)');
            for (paramName in direction) {
                var option = document.createElement("option");
                var val = direction[paramName];
                var name = paramName;

                if (value == val) option.selected = true;

                option.setAttribute("value", val);
                option.innerHTML = name;
                selectBox.appendChild(option);
            }
            return selectBox;
        }
        if (this.paramType == paramTypes.powerSource) {
            return this.getInputBoxForSpriteType(value, function (obj) { return obj.isPowerSource; });
        }
        if (this.paramType == paramTypes.pathNode) {
            return this.getInputBoxForSpriteType(value, function (obj) { return obj.isTrackNode; });
        }
        if (this.paramType == paramTypes.movable) {
            return this.getInputBoxForSpriteType(value, function (obj) { return obj.isMovable; });
        }
    }

    this.getInputBoxForSpriteType = function (value, lamda) {
        var selectBox = document.createElement("select");
        selectBox.setAttribute("id", this.paramName);
        selectBox.classList.add("editorBox");
        selectBox.setAttribute("onchange", this.paramType.onChange + '(this)');

        var options = editorSprites.filter(lamda);
        var blankOption = document.createElement("option");
        blankOption.setAttribute("value", null);
        blankOption.innerHTML = "None";
        selectBox.appendChild(blankOption);
        for (var i = 0; i < options.length; i++) {
            var option = document.createElement("option");
            var val = editorSprites.indexOf(options[i]);
            var name = options[i].name + " " + val;

            if (value == options[i]) option.selected = true;

            option.setAttribute("value", val);
            option.innerHTML = name;
            selectBox.appendChild(option);
        }
        return selectBox;
    }

    this.populateRow = function (row, value) {
        var cell1 = row.insertCell(0);
        cell1.innerHTML = this.paramName;
        var cell2 = row.insertCell(1);
        cell2.appendChild(this.getInputBox(value));
    }
}

function EditorInputChanged(el) {
    selectedSprite[el.id] = el.value;
    ValidateEditableValue(selectedSprite);
};
function EditorInputChangedInteger(el) {
    selectedSprite[el.id] = parseInt(el.value);
    ValidateEditableValue(selectedSprite);
};
function EditorInputChangedDecimal(el) {
    selectedSprite[el.id] = parseFloat(el.value);
    ValidateEditableValue(selectedSprite);
};
function EditorInputChangedBoolean(el) {
    selectedSprite[el.id] = el.checked;
    ValidateEditableValue(selectedSprite);
};
function EditorInputChangedSprite(el) {
    selectedSprite[el.id] = editorSprites[el.value];
    ValidateEditableValue(selectedSprite);
};
function EditorInputChangedText(el) {
    selectedSprite[el.id] = el.value;
    ValidateEditableValue(selectedSprite);
};
function ValidateEditableValue(editorSprite) {
    for (var i = 0; i < editorSprite.editables.length; i++) {
        var editable = editorSprite.editables[i];
        var paramName = editable.paramName;
        if (editable.validate) editorSprite[paramName] = editable.validate(editorSprite[paramName]);
    }
}


var paramTypes = {
    integer: { inputType: "number", defaultValue: 0, onChange: 'EditorInputChangedInteger' },
    decimal: { inputType: "number", defaultValue: 0, onChange: 'EditorInputChangedDecimal' },
    direction: { inputType: "number", defaultValue: 0, onChange: 'EditorInputChangedInteger' },
    boolean: { inputType: "checkbox", defaultValue: false, onChange: 'EditorInputChangedBoolean' },
    string: { inputType: "text", defaultValue: '', onChange: 'EditorInputChangedText' },
    powerSource: { onChange: 'EditorInputChangedSprite', isSpriteType: true },
    pathNode: { onChange: 'EditorInputChangedSprite', isSpriteType: true },
    movable: { onChange: 'EditorInputChangedSprite', isSpriteType: true }
};