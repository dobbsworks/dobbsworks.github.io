"use strict";
var CutsceneService = /** @class */ (function () {
    function CutsceneService() {
        this.cutscenes = [];
    }
    Object.defineProperty(CutsceneService.prototype, "isCutsceneActive", {
        get: function () {
            if (this.cutscenes.length > 0) {
                return this.cutscenes[0].hidesUI;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    CutsceneService.prototype.Update = function () {
        var _a;
        while (true) {
            if (!this.cutscenes[0])
                break;
            this.cutscenes[0].Update();
            if (this.cutscenes[0].isDone) {
                var followups = this.cutscenes[0].GetFollowUpCutscenes();
                this.cutscenes.shift();
                (_a = this.cutscenes).unshift.apply(_a, followups);
                if (this.cutscenes.length == 0)
                    break;
            }
            else {
                break;
            }
        }
    };
    CutsceneService.prototype.AddScene = function () {
        var _a;
        var scenes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scenes[_i] = arguments[_i];
        }
        (_a = this.cutscenes).push.apply(_a, scenes);
    };
    CutsceneService.prototype.Draw = function (camera) {
        var scene = this.cutscenes[0];
        if (!scene)
            return;
        var cam = new Camera(camera.canvas);
        if (BoardCutScene.backdrop) {
            BoardCutScene.backdrop.Draw(cam, 0, 0, 1, 1, false, false, 0);
        }
        for (var _i = 0, _a = BoardCutScene.sprites; _i < _a.length; _i++) {
            var sprite = _a[_i];
            sprite.Draw(cam);
        }
        scene.Draw(camera);
    };
    return CutsceneService;
}());
