function ExportLevel(name) {
    var condensedEditorSprites = [];

    var spriteManifest = [];

    // Get a list of each type of editorSprite in use
    var editorSpriteTypes = editorSprites.map(function (o) { return editorObjectTypes.filter(function (x) { return x.type == o.constructor })[0] }).distinct();
    for (var idx = 0; idx < editorSpriteTypes.length; idx++) {
        var editorSpriteType = editorSpriteTypes[idx];
        var editables = editorSpriteType.add(0,0).editables;
        var manifest = {
            i: idx,
            n: editorSpriteType.type.name,
            e: editables.map(function (x) { return x.paramName })
        }
        spriteManifest.push(manifest);
    }
    
    for (var i = 0; i < editorSprites.length; i++) {
        var editorSprite = editorSprites[i];
        var editorObjectTypeIndex = spriteManifest.filter(function (x) { return x.n == editorSprite.constructor.name })[0].i;

        var condensedEditorSprite = { a: editorObjectTypeIndex, e: [] };
        for (var j = 0; j < editorSprite.editables.length; j++) {
            var editable = editorSprite.editables[j];
            if (editable.paramType.isSpriteType) {
                var val = editorSprites.indexOf(editorSprite[editable.paramName]);
                condensedEditorSprite.e.push(val);
            } else {
                var val = editorSprite[editable.paramName];
                condensedEditorSprite.e.push(val);
            }
        }
        condensedEditorSprites.push(condensedEditorSprite);
    }

    var ret = { v: version, n: name, m: spriteManifest, s: condensedEditorSprites };

    return JSON.stringify(ret);
}

function ImportLevel(levelString) {
    if (levelString == undefined) return;
    if (levelString == '') return;
    var obj = JSON.parse(levelString);
    LoadLevel(obj);
}

function LoadLevel(levelObject) {
    if (true /* levelObject.v === '0.01' || levelObject.v === '0.1' */) {
        sprites = [];
        editorSprites = [];
        selectedSprite = null;
        var manifests = levelObject.m;
        for (var i = 0; i < levelObject.s.length; i++) {
            var importSprite = levelObject.s[i];
            var manifest = manifests.filter(function (x) { return x.i == importSprite.a })[0];
            var editorTypeName = manifest.n;
            var editorObjectType = editorObjectTypes.filter(function (x) { return x.type.name == editorTypeName })[0];
            if (editorObjectType == undefined) console.error("Failed to find object type " + editorTypeName);

            var spr = editorObjectType.add(0, 0);
            for (var j = 0; j < importSprite.e.length; j++) {
                var editable = spr.editables.filter(function (x) { return x.paramName == manifest.e[j] })[0];
                if (!editable) continue;
                var paramType = editable.paramType;
                if (paramType.isSpriteType) continue;
                var paramName = editable.paramName;
                spr[paramName] = importSprite.e[j];
            }
            editorSprites.push(spr);
        }
        for (var i = 0; i < levelObject.s.length; i++) {
            var spr = editorSprites[i];
            var importSprite = levelObject.s[i];
            var manifest = manifests.filter(function (x) { return x.i == importSprite.a })[0];
            for (var j = 0; j < importSprite.e.length; j++) {
                var editable = spr.editables.filter(function (x) { return x.paramName == manifest.e[j] })[0];
                if (!editable) continue;
                var paramType = editable.paramType;
                if (!paramType.isSpriteType) continue;
                var paramName = editable.paramName;
                spr[paramName] = editorSprites[importSprite.e[j]];
            }
        }
    } else {
        console.error("Unknown version (" + levelObject.v + ")");
    }
}