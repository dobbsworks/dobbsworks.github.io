var selectedSprite = null;
var selectedAnchor = null;
function HandleAnchors() {
    if (keyboardState.isDeletePressed() && selectedSprite != null) {
        selectedSprite.delete();
        selectedSprite = null;
        selectedAnchor = null;
    }

    if (!isMouseClicked) {
        if (selectedAnchor != null) {
            if (selectedSprite) ValidateEditableValue(selectedSprite);
            if (selectedAnchor.onRelease) {
                selectedAnchor.onRelease();
                if (selectedAnchor.parent) selectedAnchor.parent.edit();
            }
        }
        selectedAnchor = null;
        SetCursor('');
    }
    if (selectedAnchor == null) {
        if (selectedSprite != null) {
            for (var i = 0; i < selectedSprite.anchors.length; i++) {
                if (selectedSprite.anchors[i].isCoordinateWithin(mouseX, mouseY)) {
                    if (isMouseChanged && isMouseClicked) selectedAnchor = selectedSprite.anchors[i];
                    SetCursor(selectedSprite.anchors[i].anchorType.cursor);
                    break;
                }
            }
        }
        if (isMouseChanged && isMouseClicked && selectedAnchor == null) {
            for (var i = 0; i < editorSprites.length; i++) {
                if (editorSprites[i].createSprite().isMouseOver()) {
                    SelectEditorObject(i);
                    HandleAnchors();
                    return;
                }
            }
            SelectEditorObject(-1);
            document.getElementById('editables').innerHTML = '';
            selectedAnchor = cameraAnchor;
        }
    }
    if (selectedAnchor != null) {
        selectedAnchor.onChange(mouseDeltaX, mouseDeltaY);
        if (selectedSprite) ValidateEditableValue(selectedSprite);
        var editorBoxes = document.getElementsByClassName('editorBox');
        for (var i = 0; i < editorBoxes.length; i++) {
            editorBoxes[i].value = selectedSprite[editorBoxes[i].id];
        }
    }
}

function SwitchToEditMode() {
    editButton.classList.add('hidden');
    exportButton.classList.remove('hidden');
    importButton.classList.remove('hidden');
    playButton.classList.remove('hidden');
    cameraButton.classList.remove('hidden');

    mode = gameMode.edit;
    sprites = [];

    for (var i = 0; i < menus.length; i++) if (menus[i] instanceof ToolMenu) menus[i].display();
}

function SwitchToPlayMode(inEditor) {
    if (inEditor) {
        selectedSprite = null;
        UpdateEditorPanel();
        editButton.classList.remove('hidden');
        exportButton.classList.add('hidden');
        importButton.classList.add('hidden');
        playButton.classList.add('hidden');
        cameraButton.classList.add('hidden');
    }

    mode = gameMode.play;
    for (var i = 0; i < sprites.length; i++) sprites[i].kill();

    for (var i = 0; i < menus.length; i++) if (menus[i] instanceof ToolMenu) menus[i].hide();

    for (var i = 0; i < editorSprites.length; i++) {
        var newSprite = editorSprites[i].createSprite();
        sprites.push(newSprite);
    }
    for (var i = 0; i < editorSprites.length; i++) {
        var editorSprite = editorSprites[i];
        for (var j = 0; j < editorSprite.editables.length; j++) {
            var editable = editorSprite.editables[j];
            if (editable.paramType.isSpriteType) {
                var paramName = editable.paramName;
                var spriteIndex = editorSprites.indexOf(editorSprite[paramName]);
                sprites[i][paramName] = sprites[spriteIndex];
            }
        }
    }
}

function InsertEditorObject(index) {
    var newEditorSprite = editorObjectTypes[index].add(parseInt(camera.x / editorScale), parseInt(camera.y / editorScale));
    editorSprites.push(newEditorSprite);
    UpdateEditorPanel();
}

function UpdateEditorPanel() {
    for (var i = 0; i < menus.length; i++)
        if (menus[i] instanceof EditableMenu) {
            menus[i].display();
            return;
        }
    var panel = new EditableMenu();
    panel.display();
}

function SelectEditorObject(index) {
    if (index >= 0) {
        selectedSprite = editorSprites[index];
        selectedSprite.edit();
    }
    else selectedSprite = null;
    UpdateEditorPanel();
}

var editorObjectTypes = [];