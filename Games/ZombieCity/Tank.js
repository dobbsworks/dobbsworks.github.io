var viewWidth = 640;
var viewHeight = 480;
function firstMap() {
   GeneralRules.prototype.switchToMap("Level1", false);
   resizeView();
}
var gameViewContext;
var mouseInfo = {x: 0,y:0,pressed:false,oldX:0,oldY:0,clicked:false};
var currentMap;
var overlayMap;
var mainLoop = {interval:null, milliseconds:20};
function startGame() {
   initGraphicSheets();
   initFramesets();
   initTilesets();
   initTileCategories();
   firstMap();
   var gameView = document.getElementById('gameView');

   gameView.onmousedown = function(e) {
      e = e || window.event;
      mouseInfo.x = e.clientX;
      mouseInfo.y = e.clientY;
      mouseInfo.pressed = true;
      mouseInfo.clicked = true;
   };

   gameView.onmousemove = function(e) {
      e = e || window.event;
      mouseInfo.x = e.clientX;
      mouseInfo.y = e.clientY;
   };

   gameView.onmouseup = function(e) {
      mouseInfo.pressed = false;
   };

   gameView.onmouseout = function(e) {
      mouseInfo.pressed = false;
   };

   gameView.ontouchstart = function(e) {
      e = e || window.event;
      e.preventDefault();
      var touch = e.touches.item(0);
      mouseInfo.x = touch.clientX;
      mouseInfo.y = touch.clientY;
      mouseInfo.pressed = true;
      mouseInfo.clicked = true;
   };

   gameView.ontouchmove = function(e) {
      e = e || window.event;
      e.preventDefault();
      var touch = e.touches.item(0);
      mouseInfo.x = touch.clientX;
      mouseInfo.y = touch.clientY;
      mouseInfo.pressed = true;
   };
   
   gameView.ontouchend = function(e) {
      e = e || window.event;
      e.preventDefault();
      mouseInfo.pressed = false;
   }

   gameViewContext = gameView.getContext('2d');
   mainLoop.interval = setInterval("pulse()", mainLoop.milliseconds);
}

function pulse() {
   if (currentMap != null)
   {
      currentMap.draw(gameViewContext);
      currentMap.executeRules();
   }
   GeneralRules.drawMessages();
   if (overlayMap != null)
   {
      overlayMap.draw(gameViewContext);
      overlayMap.executeRules();
   }
   DrawMeter(gameViewContext, 5, 325, 15, 150, 
      counters.MissileEnergy.value, 
      counters.MissileEnergy.max,
      counters.MissileEnergy.max / counters.EnergyCostPerMissile.value);
   cycleMouseInfo();
}

function cycleMouseInfo() {
   mouseInfo.oldX = mouseInfo.x;
   mouseInfo.oldY = mouseInfo.y;
   mouseInfo.clicked = false;
}

function resizeView() {
   //viewWidth = window.innerWidth;
   //viewHeight = window.innerHeight;
   var gameView = document.getElementById('gameView');
   //gameView.width = viewWidth;
   //gameView.height = viewHeight;
   if ((gameViewContext != null) && (currentMap != null))
      currentMap.draw(gameViewContext);
}

function truncate(n) {
   return n | 0;
}

function GraphicSheet(image, cellWidth, cellHeight, columns, rows) {
   this.image = image;
   this.cellWidth = cellWidth;
   this.cellHeight = cellHeight;
   this.columns = columns;
   this.rows = rows;
}
var graphicSheets;
function initGraphicSheets() {
   graphicSheets = {
      Balloon: new GraphicSheet(document.getElementById('Balloon'), 7,13,1,1),
      Bomb: new GraphicSheet(document.getElementById('Bomb'), 5,5,3,1),
      CoolFont: new GraphicSheet(document.getElementById('CoolFont'), 13,18,24,4),
      Cursor: new GraphicSheet(document.getElementById('Cursor'), 9,9,1,1),
      Explosion: new GraphicSheet(document.getElementById('Explosion'), 8,8,4,2),
      FireFont: new GraphicSheet(document.getElementById('FireFont'), 13,18,24,4),
      Tank: new GraphicSheet(document.getElementById('Tank'), 14,8,2,1),
      Terrain: new GraphicSheet(document.getElementById('Terrain'), 8,8,4,8),
      Zombie: new GraphicSheet(document.getElementById('Zombie'), 5,9,4,2)
   };
}
function Frameset(name, frames) {
   this.name = name;
   this.frames = frames;
}
function XFrame(m11, m12, m21, m22, dx, dy, graphicSheet, imageSource, cellIndex) {
   this.m11 = m11;
   this.m12 = m12;
   this.m21 = m21;
   this.m22 = m22;
   this.dx = dx;
   this.dy = dy;
   this.graphicSheet = graphicSheet;
   this.imageSource = imageSource;
   this.cellIndex = cellIndex;
}
function Frame(graphicSheet, imageSource, cellIndex) {
   this.graphicSheet = graphicSheet;
   this.imageSource = imageSource;
   this.cellIndex = cellIndex;
}
Frame.prototype.draw = function(ctx, x, y) {
   if (this.imageSource == null) return;
   ctx.drawImage(this.imageSource, (this.cellIndex % this.graphicSheet.columns) * this.graphicSheet.cellWidth,
   Math.floor(this.cellIndex / this.graphicSheet.columns) * this.graphicSheet.cellHeight,
   this.graphicSheet.cellWidth, this.graphicSheet.cellHeight, x, y, this.graphicSheet.cellWidth, this.graphicSheet.cellHeight);
};
XFrame.prototype.draw = function(ctx, x, y) {
   ctx.save();
   ctx.transform(this.m11, this.m12, this.m21, this.m22, this.dx+x, this.dy+y);
   ctx.drawImage(this.imageSource, (this.cellIndex % this.graphicSheet.columns) * this.graphicSheet.cellWidth,
      Math.floor(this.cellIndex / this.graphicSheet.columns) * this.graphicSheet.cellHeight,
      this.graphicSheet.cellWidth, this.graphicSheet.cellHeight, 0, 0, this.graphicSheet.cellWidth, this.graphicSheet.cellHeight);
   ctx.restore();
};
function ModulateCelColor(target, x, y, width, height, r, g, b, a) {
   var cel;
   try { cel = target.getImageData(x, y, width, height); }
   catch(e) {
      document.write('Failed to process images. This may occur when running from local files; see <a href="http://stackoverflow.com/questions/2704929/uncaught-error-security-err-dom-exception-18">see details</a>');
      throw(e);
   }
   var celData = cel.data;
   for (yi = 0; yi < height; yi++) {
      for (xi = 0; xi < width; xi++) {
         var byteIdx = (yi * width + xi) * 4;
         celData[byteIdx] = Math.floor(celData[byteIdx] * r / 255);
         celData[byteIdx+1] = Math.floor(celData[byteIdx+1] * g / 255);
         celData[byteIdx+2] = Math.floor(celData[byteIdx+2] * b / 255);
         celData[byteIdx+3] = Math.floor(celData[byteIdx+3] * a / 255);
      }
   }
   target.putImageData(cel, x, y);
}
var frameSets = new Object();
function initFramesets() {
   var ctx;
   var gfx;
   frameSets.Balloon = new Frameset('Balloon', [
      new XFrame(4,0,0,4,0,0,graphicSheets.Balloon,graphicSheets.Balloon.image,0)]);
   frameSets.Bomb = new Frameset('Bomb', [
      new XFrame(4,0,0,4,0,0,graphicSheets.Bomb,graphicSheets.Bomb.image,0),
      new XFrame(4,0,0,4,0,0,graphicSheets.Bomb,graphicSheets.Bomb.image,1),
      new XFrame(4,0,0,4,0,0,graphicSheets.Bomb,graphicSheets.Bomb.image,2)]);
   frameSets.CoolFontFrames = new Frameset('CoolFontFrames', [
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,0),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,1),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,2),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,3),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,4),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,5),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,6),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,7),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,8),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,9),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,10),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,11),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,12),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,13),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,14),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,15),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,16),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,17),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,18),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,19),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,20),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,21),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,22),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,23),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,24),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,25),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,26),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,27),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,28),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,29),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,30),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,31),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,32),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,33),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,34),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,35),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,36),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,37),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,38),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,39),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,40),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,41),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,42),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,43),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,44),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,45),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,46),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,47),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,48),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,49),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,50),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,51),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,52),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,53),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,54),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,55),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,56),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,57),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,58),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,59),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,60),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,61),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,62),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,63),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,64),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,65),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,66),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,67),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,68),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,69),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,70),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,71),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,72),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,73),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,74),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,75),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,76),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,77),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,78),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,79),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,80),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,81),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,82),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,83),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,84),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,85),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,86),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,87),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,88),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,89),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,90),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,91),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,92),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,93),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,94),
      new Frame(graphicSheets.CoolFont,graphicSheets.CoolFont.image,95)]);
   frameSets.Cursor = new Frameset('Cursor', [
      new XFrame(4,0,0,4,0,0,graphicSheets.Cursor,graphicSheets.Cursor.image,0)]);
   frameSets.Explosion = new Frameset('Explosion', [
      new XFrame(4,0,0,4,0,0,graphicSheets.Explosion,graphicSheets.Explosion.image,0),
      new XFrame(4,0,0,4,0,0,graphicSheets.Explosion,graphicSheets.Explosion.image,1),
      new XFrame(4,0,0,4,0,0,graphicSheets.Explosion,graphicSheets.Explosion.image,2),
      new XFrame(4,0,0,4,0,0,graphicSheets.Explosion,graphicSheets.Explosion.image,3),
      new XFrame(4,0,0,4,0,0,graphicSheets.Explosion,graphicSheets.Explosion.image,4),
      new XFrame(4,0,0,4,0,0,graphicSheets.Explosion,graphicSheets.Explosion.image,5),
      new XFrame(4,0,0,4,0,0,graphicSheets.Explosion,graphicSheets.Explosion.image,6),
      new XFrame(4,0,0,4,0,0,graphicSheets.Explosion,graphicSheets.Explosion.image,7)]);
   frameSets.FireFontFrames = new Frameset('FireFontFrames', [
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,0),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,1),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,2),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,3),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,4),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,5),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,6),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,7),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,8),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,9),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,10),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,11),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,12),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,13),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,14),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,15),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,16),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,17),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,18),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,19),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,20),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,21),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,22),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,23),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,24),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,25),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,26),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,27),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,28),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,29),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,30),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,31),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,32),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,33),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,34),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,35),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,36),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,37),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,38),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,39),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,40),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,41),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,42),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,43),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,44),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,45),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,46),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,47),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,48),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,49),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,50),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,51),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,52),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,53),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,54),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,55),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,56),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,57),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,58),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,59),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,60),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,61),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,62),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,63),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,64),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,65),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,66),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,67),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,68),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,69),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,70),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,71),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,72),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,73),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,74),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,75),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,76),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,77),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,78),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,79),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,80),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,81),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,82),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,83),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,84),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,85),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,86),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,87),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,88),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,89),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,90),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,91),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,92),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,93),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,94),
      new Frame(graphicSheets.FireFont,graphicSheets.FireFont.image,95)]);
   frameSets.Tank = new Frameset('Tank', [
      new XFrame(4,0,0,4,0,0,graphicSheets.Tank,graphicSheets.Tank.image,0),
      new XFrame(4,0,0,4,0,0,graphicSheets.Tank,graphicSheets.Tank.image,1),
      new XFrame(-4,0,0,4,56,0,graphicSheets.Tank,graphicSheets.Tank.image,0),
      new XFrame(-4,0,0,4,56,0,graphicSheets.Tank,graphicSheets.Tank.image,1)]);
   frameSets.Terrain = new Frameset('Terrain', [
      new XFrame(4,0,0,4,0,0,graphicSheets.Terrain,graphicSheets.Terrain.image,0),
      new XFrame(4,0,0,4,0,0,graphicSheets.Terrain,graphicSheets.Terrain.image,1),
      new XFrame(4,0,0,4,0,0,graphicSheets.Terrain,graphicSheets.Terrain.image,2),
      new XFrame(4,0,0,4,0,0,graphicSheets.Terrain,graphicSheets.Terrain.image,3),
      new XFrame(4,0,0,4,0,0,graphicSheets.Terrain,graphicSheets.Terrain.image,4),
      new XFrame(4,0,0,4,0,0,graphicSheets.Terrain,graphicSheets.Terrain.image,5),
      new XFrame(4,0,0,4,0,0,graphicSheets.Terrain,graphicSheets.Terrain.image,6),
      new XFrame(4,0,0,4,0,0,graphicSheets.Terrain,graphicSheets.Terrain.image,7)]);
   frameSets.Zombie = new Frameset('Zombie', [
      new XFrame(4,0,0,4,0,0,graphicSheets.Zombie,graphicSheets.Zombie.image,0),
      new XFrame(4,0,0,4,0,0,graphicSheets.Zombie,graphicSheets.Zombie.image,1),
      new XFrame(4,0,0,4,0,0,graphicSheets.Zombie,graphicSheets.Zombie.image,2),
      new XFrame(4,0,0,4,0,0,graphicSheets.Zombie,graphicSheets.Zombie.image,3),
      new XFrame(-4,0,0,4,20,0,graphicSheets.Zombie,graphicSheets.Zombie.image,0),
      new XFrame(-4,0,0,4,20,0,graphicSheets.Zombie,graphicSheets.Zombie.image,1),
      new XFrame(-4,0,0,4,20,0,graphicSheets.Zombie,graphicSheets.Zombie.image,2),
      new XFrame(-4,0,0,4,20,0,graphicSheets.Zombie,graphicSheets.Zombie.image,3),
      new XFrame(4,0,0,4,0,0,graphicSheets.Zombie,graphicSheets.Zombie.image,4),
      new XFrame(4,0,0,4,0,0,graphicSheets.Zombie,graphicSheets.Zombie.image,5),
      new XFrame(4,0,0,4,0,0,graphicSheets.Zombie,graphicSheets.Zombie.image,6),
      new XFrame(4,0,0,4,0,0,graphicSheets.Zombie,graphicSheets.Zombie.image,7)]);
}
function Counter(value, min, max) {
   this.value = value;
   this.min = min;
   this.max = max;
}
var counters = {
   EnergyCostPerMissile: new Counter(25, 0, 100),
   MissileEnergy: new Counter(150, 0, 150),
   MissileEnergyRechargeTimer: new Counter(1, 0, 50)
};
function Tileset(name, tileWidth, tileHeight, frameSet, tiles) {
   this.name = name;
   this.tileWidth = tileWidth;
   this.tileHeight = tileHeight;
   this.frameSet = frameSet;
   this.tiles = tiles;
}
function TileFrame(accumulatedDuration, subFrames) {
   this.accumulatedDuration = accumulatedDuration;
   this.subFrames = subFrames;
}
function AnimTile(counter, frames) {
   this.counter = counter;
   this.frames = frames;
   this.totalDuration = frames[frames.length - 1].accumulatedDuration;
}
AnimTile.prototype.getCurFrameIndex = function() {
   for(var i = 0; i < this.frames.length; i++) {
      if((this.counter.value % this.totalDuration) < this.frames[i].accumulatedDuration) return i;
   }
   return this.frames.length - 1;
};
AnimTile.prototype.getCurFrames = function() {
   return this.frames[this.getCurFrameIndex()].subFrames;
};
var tilesets = new Object();
function initTilesets() {
   tilesets.CoolText = new Tileset('CoolText',11,15, frameSets.CoolFontFrames,[null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,null,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128]);
   tilesets.FireText = new Tileset('FireText',11,15, frameSets.FireFontFrames,[null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,null,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128]);
   tilesets.Terrain = new Tileset('Terrain',32,32, frameSets.Terrain,[0,1,2,3,4,5,6,7]);
};
var keyboardState;
keyboardState = new Object();
keyboardState.key= { None:0, Enter:13, Shift:16, Ctrl:17, Alt: 18, Pause:19, Escape:27, Space:32, PageUp:33, PageDown:34,
   End:35, Home:36, Left:37, Up:38, Right:39, Down:40, Insert:45, Delete:46,
   Digit0:48, Digit1:49, Digit2:50, Digit3:51, Digit4:52, Digit5:53, Digit6:54, Digit7:55, Digit8:56, Digit9:57,
   A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77, N:78, O:79,
   P: 80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90,
   LWindow:91, RWindow:92, ContextMenu:93,
   NumPad0:96, NumPad1:97, NumPad2:98, NumPad3:99, NumPad4:100, NumPad5:101, NumPad6:102, NumPad7:103, NumPad8:104, NumPad9:105,
   NumPadMultiply:106, NumPadAdd:107, NumPadEnter:108, NumPadSubtract:109, NumPadDecimal:110, NumPadDivide:111,
   F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123,
   NumLock:144, ScrollLock:145,
   SemiColon:186, Equal:187, Comma:188, Minus:189, Period:190, Slash:191, Backtick:192,
   LeftBracket:219, BackSlash:220, RightBracket:221, Quote:222 };

keyboardState.keyState = new Array();
keyboardState.handleKeyDown = function(e) {
   e = e || window.event;
   keyboardState.keyState[e.keyCode] = true;
};

keyboardState.handleKeyUp = function(e) {
   e = e || window.event;
   keyboardState.keyState[e.keyCode] = false;
};

keyboardState.isKeyPressed = function(key) { return keyboardState.keyState[key]; };

document.onkeydown = keyboardState.handleKeyDown;
document.onkeyup = keyboardState.handleKeyUp;

function KeyboardPlayer(defaultSet) {
   switch(defaultSet)
   {
      case 0:
         this.initializeKeys(
            keyboardState.key.Up,     // Up
            keyboardState.key.Left,   // Left
            keyboardState.key.Right,  // Right
            keyboardState.key.Down,   // Down
            keyboardState.key.Ctrl,   // Button 1
            keyboardState.key.Space,  // Button 2
            keyboardState.key.Enter,  // Button 3
            keyboardState.key.Shift); // Button 4
         break;
      case 1:
         this.initializeKeys(
            keyboardState.key.W,     // Up
            keyboardState.key.A,     // Left
            keyboardState.key.D,     // Right
            keyboardState.key.S,     // Down
            keyboardState.key.Z,     // Button 1
            keyboardState.key.C,     // Button 2
            keyboardState.key.Q,     // Button 3
            keyboardState.key.E);    // Button 4
         break;
      case 2:
         this.initializeKeys(
            keyboardState.key.NumPad8,      // Up
            keyboardState.key.NumPad4,      // Right
            keyboardState.key.NumPad6,      // Left
            keyboardState.key.NumPad2,      // Down
            keyboardState.key.NumPad5,      // Button 1
            keyboardState.key.NumPad0,      // Button 2
            keyboardState.key.NumPadEnter,  // Button 3
            keyboardState.key.NumPad7);     // Button 4
         break;
      default:
         this.initializeKeys(
            keyboardState.key.I,            // Up
            keyboardState.key.J,            // Right
            keyboardState.key.L,            // Left
            keyboardState.key.K,            // Down
            keyboardState.key.U,            // Button 1
            keyboardState.key.O,            // Button 2
            keyboardState.key.M,            // Button 3
            keyboardState.key.Comma);       // Button 4
         break;
   }
}

KeyboardPlayer.prototype.initializeKeys = function(up, left, right, down, button1, button2, button3, button4) {
   this.upKey = up;
   this.leftKey = left;
   this.rightKey = right;
   this.downKey = down;
   this.button1Key = button1;
   this.button2Key = button2;
   this.button3Key = button3;
   this.button4Key = button4;
};

KeyboardPlayer.prototype.up = function() { return keyboardState.keyState[this.upKey]; };
KeyboardPlayer.prototype.left = function() { return keyboardState.keyState[this.leftKey]; };
KeyboardPlayer.prototype.right = function() { return keyboardState.keyState[this.rightKey]; };
KeyboardPlayer.prototype.down = function() { return keyboardState.keyState[this.downKey]; };
KeyboardPlayer.prototype.button1 = function() { return keyboardState.keyState[this.button1Key]; };
KeyboardPlayer.prototype.button2 = function() { return keyboardState.keyState[this.button2Key]; };
KeyboardPlayer.prototype.button3 = function() { return keyboardState.keyState[this.button3Key]; };
KeyboardPlayer.prototype.button4 = function() { return keyboardState.keyState[this.button4Key]; };

var players = [ new KeyboardPlayer(0), new KeyboardPlayer(1), new KeyboardPlayer(2), new KeyboardPlayer(3) ];
function GeneralRules() {
}

GeneralRules.buttonSpecifier = {first:1, second:2, third:4, fourth:8, freezeInputs:16};
GeneralRules.maxMessages = 4;
GeneralRules.messageBackground = "rgba(64, 0, 255, .5)";
GeneralRules.currentPlayer = 0;
GeneralRules.activeMessages = [];
GeneralRules.messageMargin = 6;

GeneralRules.prototype.saveGame = function(slot, temporary) {
   if (GeneralRules.saveUnit == null) {
      this.includeInSaveUnit("AllMaps");
      this.includeInSaveUnit("AllCounters");
      this.includeInSaveUnit("WhichMapIsCurrent");
      this.includeInSaveUnit("WhichMapIsOverlaid");
   }
   if (GeneralRules.saveUnit.allMaps) {
      GeneralRules.saveUnit.maps = {};
      for(var key in maps) {
         GeneralRules.saveUnit.maps[key] = maps[key].getState();
      }
   } else if (GeneralRules.saveUnit.maps !== undefined) {
      for(var key in GeneralRules.saveUnit.maps) {
         GeneralRules.saveUnit.maps[key] = maps[key].getState();
      }
   }
   if (GeneralRules.saveUnit.counters != null) {
      for(var key in GeneralRules.saveUnit.counters) {
         GeneralRules.saveUnit.counters[key] = counters[key];
      }
   }
   if (GeneralRules.saveUnit.currentMap !== undefined)
      GeneralRules.saveUnit.currentMap = getMapName(currentMap);
   if (GeneralRules.saveUnit.overlayMap !== undefined)
      GeneralRules.saveUnit.overlayMap = getMapName(overlayMap);
   if (temporary)
      GeneralRules["save" + slot] = JSON.stringify(GeneralRules.saveUnit);
   else
      localStorage.setItem("save" + slot, JSON.stringify(GeneralRules.saveUnit));
   GeneralRules.saveUnit = null;
};

GeneralRules.prototype.loadGame = function(slot, temporary) {
   var data;
   if (temporary)
      data = GeneralRules["save" + slot];
   else
      data = localStorage.getItem("save" + slot);
   if (data == null) return;
   data = JSON.parse(data);
   for(var key in data.maps)
   {
      if (maps[key] == null)
         mapInitializers[key]();
      maps[key].setState(data.maps[key]);
   }
   if (data.allMaps)
   {
      for(var key in maps)
         if (data.maps[key] == null)
            delete maps[key];
   }
   if (data.counters != null) {
      for(var key in data.counters)
         counters[key].value = data.counters[key].value; // Tile definitions are linked to the original counter instance
   }
   if (data.currentMap !== undefined) {
      if (maps[data.currentMap] === undefined)
         mapInitializers[data.currentMap]();
      currentMap = maps[data.currentMap];
   }
   if (data.overlayMap !== undefined)
      this.setOverlay(data.overlayMap);
};

GeneralRules.prototype.deleteSave = function(slot, temporary) {
   if (temporary)
      delete GeneralRules["save" + slot];
   else
      localStorage.removeItem("save" + slot);
}

GeneralRules.prototype.saveExists = function(slot, temporary) {
   if (temporary)
      return GeneralRules["save" + slot] != null;
   else
      return localStorage.getItem("save" + slot) != null;
};

GeneralRules.prototype.includeMapInSaveUnit = function(mapName) {
   if (GeneralRules.saveUnit == null)
      GeneralRules.saveUnit = {};
   if (GeneralRules.saveUnit.maps == null)
      GeneralRules.saveUnit.maps = {};
   GeneralRules.saveUnit.maps[mapName] = null;
};

GeneralRules.prototype.excludeMapFromSaveUnit = function(mapName) {
   if ((GeneralRules.saveUnit == null) || (GeneralRules.saveUnit.maps == null))
      return;
   if (GeneralRules.saveUnit.maps[mapName] !== undefined)
      delete GeneralRules.saveUnit.maps[mapName];
}

GeneralRules.prototype.includeInSaveUnit = function(include) {
   if (GeneralRules.saveUnit == null)
      GeneralRules.saveUnit = {};

   switch (include) {
      case "AllMaps":
         GeneralRules.saveUnit.allMaps = true;
         break;
      case "AllCounters":
         GeneralRules.saveUnit.counters = {};
         for(key in counters)
            GeneralRules.saveUnit.counters[key] = null;
         break;
      case "WhichMapIsCurrent":
         GeneralRules.saveUnit.currentMap = null;
         break;
      case "WhichMapIsOverlaid":
         GeneralRules.saveUnit.overlayMap = null;
         break;
      case "PlayerOptions":
         // Not implemented
         break;
   }
};

GeneralRules.prototype.includeCounterInSaveUnit = function(counter) {
   if (GeneralRules.saveUnit == null)
      GeneralRules.saveUnit = {};
   if (GeneralTules.saveUnit.counters == null)
      GeneralRules.saveUnit.counters = {};
   GeneralRules.saveUnit.counters[key] = null;
}

GeneralRules.prototype.excludeCounterFromSaveUnit = function(counter) {
   if ((GeneralRules.saveUnit == null) || (GeneralRules.saveUnit.counters == null))
      return;
   for (key in GeneralRules.saveUnit.counters) {
      if (counters[key] === counter)
         delete GeneralRules.saveUnit.counters[key];
   }
};

GeneralRules.prototype.changeCounter = function(counter, operation) {
   switch (operation) {
      case "IncrementAndStop":
         if (counter.value < counter.max)
            counter.value += 1;
         else
            return true;
         return false;
      case "DecrementAndStop":
         if (counter.value > counter.min)
            counter.value -= 1;
         else
            return true;
         return false;
      case "IncrementAndLoop":
         if (counter.value < counter.max)
         {
            counter.value += 1;
            return false;
         }
         counter.value = counter.min;
         return true;
      case "DecrementAndLoop":
         if (counter.value > counter.min) {
            counter.value -= 1;
            return false;
         }
         counter.value = counter.max;
         return true;
      case "SetToMinimum":
         if (counter.value == counter.min)
            return true;
         counter.value = counter.min;
         return false;
      case "SetToMaximum":
         if (counter.value == counter.max)
            return true;
         counter.value = counter.max;
         return false;
   }
   return false;
};

GeneralRules.prototype.setMapFlag = function(flagIndex, value) {
   if (this.layer.map.mapFlags == null)
      this.layer.map.mapFlags = 0;
   if (value)
      this.layer.map.mapFlags |= 1 << flagIndex;
   else
      this.layer.map.mapFlags &= ~(1 << flagIndex);
};

GeneralRules.prototype.isMapFlagOn = function(flagIndex) {
   if (this.layer.map.mapFlags == null)
      this.layer.map.mapFlags = 0;
   return ((this.layer.map.mapFlags & (1 << flagIndex)) != 0);
};

GeneralRules.prototype.setTargetMapFlag = function(mapName, flagIndex, value) {
   if (value)
      maps[mapName].mapFlags |= 1 << flagIndex;
   else
      maps[mapName].mapFlags &= ~(1 << flagIndex);
}

GeneralRules.prototype.clearOverlay = function() {
   overlayMap = null;
};

GeneralRules.prototype.clearAllMessages = function() {
   GeneralRules.activeMessages.length = 0;
};

GeneralRules.prototype.canReturnToPreviousMap = function() {
   return currentMap.cameFromMapName != null;
};

GeneralRules.prototype.returnToPreviousMap = function(unloadCurrent) {
   var source = currentMap.cameFromMapName;
   if (source == null)
      source = getMapName(currentMap);
   if (unloadCurrent)
      for(var key in maps)
         if (maps[key] == currentMap)
            delete maps[key];
   if (maps[source] === undefined)
      mapInitializers[source]();
   currentMap = maps[source];
};

GeneralRules.prototype.switchToMap = function(mapName, unloadCurrent) {
   var oldMapName = null;
   if (currentMap != null) {
      for(key in maps) {
         if (maps[key] === currentMap) {
            if (unloadCurrent)
               delete maps[key];
            oldMapName = key;
         }
      }
   }
   if (maps[mapName] === undefined)
      mapInitializers[mapName]();
   currentMap = maps[mapName];
   currentMap.cameFromMapName = oldMapName;
};

GeneralRules.prototype.isKeyPressed = function(key) {
   return keyboardState.isKeyPressed(key);
};

GeneralRules.prototype.setOverlay = function(mapName) {
   if (maps[mapName] === undefined)
      mapInitializers[mapName]();
   overlayMap = maps[mapName];
};

GeneralRules.prototype.unloadBackgroundMaps = function() {
   for(key in maps) {
      if ((maps[key] !== currentMap) && (maps[key] !== overlayMap))
         delete maps[key];
   }
};

GeneralRules.prototype.unloadMap = function(mapName) {
   delete maps[mapName];
}

GeneralRules.prototype.setMessageFont = function(tileset) {
   GeneralRules.fontTileset = tileset;
};

GeneralRules.colorNameToRgba = function(color, alpha) {
    var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    return "rgba(" + parseInt(colors[color].substr(1,2), 16) + "," + parseInt(colors[color].substr(3,2), 16) + "," + parseInt(colors[color].substr(5,2), 16) + "," + alpha/255 + ")";
};

GeneralRules.prototype.setMessageBackground = function(color, alpha) {
   GeneralRules.messageBackground = GeneralRules.colorNameToRgba(color, alpha);
};

GeneralRules.prototype.setMessageDismissal = function(dismissButton, player) {
   GeneralRules.dismissButton = dismissButton;
   GeneralRules.currentPlayer = player - 1;
};

GeneralRules.prototype.showMessage = function(message) {
   if (GeneralRules.activeMessages.length >= GeneralRules.maxMessages)
      throw "Maximum number of displayed messages exceeded";
   else
      GeneralRules.activeMessages.push(this.createMessage(message));
};

function MessageLayer(tileset, map, columns, rows, offsetX, offsetY, background, player, dismissButton) {
   MapLayer.call(this, map, tileset, columns, rows, 0, 0, offsetX, offsetY, 0, 0, 0, null);
   this.background = background;
   this.dismissButton = dismissButton;
   this.player = player;
}

MessageLayer.prototype = new MapLayer();
MessageLayer.prototype.constructor = MessageLayer;

GeneralRules.playerPressButton = function(playerNumber) {
   for (var i = 0; i < GeneralRules.activeMessages.length; i++) {
      var msg = GeneralRules.activeMessages[i];
      if (msg.player == playerNumber - 1) {
         var player = players[playerNumber - 1];
         var dismissPressed = false;
         if ((msg.dismissButton & GeneralRules.buttonSpecifier.first) && player.button1())
            dismissPressed = true;
         if ((msg.dismissButton & GeneralRules.buttonSpecifier.second) && player.button2())
            dismissPressed = true;
         if ((msg.dismissButton & GeneralRules.buttonSpecifier.third) && player.button3())
            dismissPressed = true;
         if ((msg.dismissButton & GeneralRules.buttonSpecifier.fourth) && player.button4())
            dismissPressed = true;

         // dismissPhase[x]:
         // 0 = No frames have passed yet
         // 1 = Frames have passed and the dismiss button was initially pressed
         // 2 = Frames have passed and the dismiss button is not pressed
         // 3 = Dismiss button was not pressed, but now it is.

         if (GeneralRules.dismissPhase == null)
            GeneralRules.dismissPhase = [0,0,0,0];

         if (dismissPressed) {
            if ((GeneralRules.dismissPhase[msg.player] == 0) || (GeneralRules.dismissPhase[msg.player] == 2))
               GeneralRules.dismissPhase[msg.player]++;
         } else {
            if (GeneralRules.dismissPhase[msg.player] < 2)
               GeneralRules.dismissPhase[msg.player] = 2;
            else if (GeneralRules.dismissPhase[msg.player] > 2) {
               GeneralRules.dismissMessage(i);
               GeneralRules.dismissPhase[msg.player] = 0;
            }
         }

         if (msg.dismissButton & GeneralRules.buttonSpecifier.freezeInputs) {
            return false;
         }
      }
   }
   return true;
};

GeneralRules.dismissMessage = function (messageIndex) {
   GeneralRules.activeMessages.splice(messageIndex, 1);
};

GeneralRules.prototype.createMessage = function(message) {
   if (GeneralRules.fontTileset == null) {
      var tilesetKey;
      for (tilesetKey in tilesets)
         break;
      GeneralRules.fontTileset = tilesets[tilesetKey];
   }

   var x = 0, y = 1;
   var maxWidth = 1;
   for (var charIdx = 0; charIdx < message.length; charIdx++) {
      if (message[charIdx] == '\n') {
         x = 0;
         y++;
      } else if (message[charIdx] != '\r') {
         if (++x > maxWidth)
            maxWidth = x;
      }
   }

   var messageSize = {width: maxWidth * GeneralRules.fontTileset.tileWidth, height: y * GeneralRules.fontTileset.tileHeight};
   var messageX = Math.floor((viewWidth - messageSize.width) / 2);
   var messageY = Math.floor((viewHeight - messageSize.height) / 2);

   var result = new MessageLayer(
      GeneralRules.fontTileset, this.layer.map, maxWidth, y, messageX, messageY,
      GeneralRules.messageBackground, GeneralRules.currentPlayer, GeneralRules.dismissButton);

   x = 0;
   y = 0;
   for (var charIdx = 0; charIdx < message.length; charIdx ++) {
      if (message.charAt(charIdx) == '\n') {
         x = 0;
         y++;
      } else if (message.charAt(charIdx) != '\r') {
         result.setTile(x++, y, message.charCodeAt(charIdx));
      }
   }

   return result;
}

GeneralRules.drawMessage = function(msg) {
   var messageRect = {
      x: msg.currentX - GeneralRules.messageMargin,
      y: msg.currentY - GeneralRules.messageMargin,
      width: msg.virtualColumns * msg.tileset.tileWidth + GeneralRules.messageMargin * 2,
      height: msg.virtualRows * msg.tileset.tileHeight + GeneralRules.messageMargin * 2};
   gameViewContext.fillStyle = msg.background;
   gameViewContext.fillRect(messageRect.x, messageRect.y, messageRect.width, messageRect.height);
   gameViewContext.strokeStyle = "#ffffff";
   gameViewContext.lineWidth = 2;
   gameViewContext.strokeRect(messageRect.x, messageRect.y, messageRect.width, messageRect.height);
   msg.draw(gameViewContext);
};

GeneralRules.drawMessages = function() {
   for (var i = 0; i < GeneralRules.activeMessages.length; i++) {
      var msg = GeneralRules.activeMessages[i];
      GeneralRules.drawMessage(msg);
   }
};

GeneralRules.prototype.limitFrameRate = function(fps) {
   if (fps == 0) {
      mainLoop.milliseconds = 0;
      if (mainLoop.interval != null)
         clearInterval(mainLoop.interval);
      mainLoop.interval = null;
      return;
   }

   var milliseconds = Math.ceil(1000 / fps);
   if (milliseconds != mainLoop.milliseconds) {
      if (mainLoop.interval != null)
         clearInterval(mainLoop.interval);
      mainLoop.milliseconds = milliseconds;
      mainLoop.interval = setInterval("pulse()", mainLoop.milliseconds);
   }
};

GeneralRules.prototype.setCategorySpriteState = function(category, spriteIndex, state) {
   category[spriteIndex].state = state;
};

GeneralRules.prototype.quitGame = function() {
   window.close();
};

GeneralRules.prototype.getRandomNumber = function(minimum, maximum) {
   return Math.floor(Math.random() * (maximum - minimum)) + minimum;
};

GeneralRules.prototype.dragMap = function () {
   if (mouseInfo.pressed && !mouseInfo.clicked)
      currentMap.scroll(currentMap.scrollX + mouseInfo.x - mouseInfo.oldX, currentMap.scrollY + mouseInfo.y - mouseInfo.oldY);
};

GeneralRules.prototype.clicked = function() {
   return mouseInfo.clicked;
};
function SpriteState(solidWidth, solidHeight, frameSetName, bounds, frames) {
   this.solidWidth = solidWidth;
   this.solidHeight = solidHeight;
   this.frameSetName = frameSetName;
   this.bounds = bounds;
   this.frames = frames;
   this.totalDuration = frames ? frames[frames.length - 1].accumulatedDuration : 0;
}

function Sprite(layer, x, y, dx, dy, state, frame, active, priority, solidity) {
   this.layer = layer;
   this.x = x;
   this.y = y;
   this.dx = dx;
   this.dy = dy;
   this.state = state;
   this.frame = frame;
   this.isActive = active;
   this.priority = priority;
   this.solidity = solidity;
   this.ridingOn = null;
   this.localDX = null;
   this.inputs = 0;
   this.oldInputs = 0;
}

Sprite.prototype = new GeneralRules();
Sprite.prototype.constructor = Sprite;

Sprite.categorize = function(sprites) {
   var categories = {};
   for(var sprKey in sprites) {
      var spr = sprites[sprKey];
      if (spr.categories == null) continue;
      for(var sprCatKey in spr.categories) {
         var cat = spr.categories[sprCatKey];
         if (categories[cat] == null)
            categories[cat] = [spr];
         else
            categories[cat].push(spr);
      }
   }
   return categories;
}

Sprite.deserialize = function(layer,data) {
   var source = JSON.parse(data);
   return spriteDefinitions[source["~1"]].deserialize(layer, data);
}

Sprite.prototype.getCurFrames = function() {
   var curState = this.states[this.state];
   if (curState.frames == null) return null;
   for(var i = 0; i < curState.frames.length; i++) {
      if((this.frame % curState.totalDuration) < curState.frames[i].accumulatedDuration) return curState.frames[i].subFrames;
   }
   return curState.frames[curState.frames.length - 1].subFrames;
};

Sprite.prototype.getSolidWidth = function() {
   return this.states[this.state].solidWidth;
};

Sprite.prototype.getSolidHeight = function() {
   return this.states[this.state].solidHeight;
};

Sprite.prototype.reactToSolid = function() {
   if (this.solidity == null)
      return;
   var hit = false;
   var dyOrig = this.dy;
   var dxOrig = this.dx;

   var proposedPixelY2 = Math.ceil(this.y + this.dy);
   var pixelX = Math.floor(this.x);
   var pixelY = Math.floor(this.y);
   var solidWidth = this.getSolidWidth();
   var solidHeight = this.getSolidHeight();
   var proposedPixelX = Math.floor(this.x + this.dx);
   var proposedPixelY = Math.floor(this.y + this.dy);
   var solidPixelWidth = solidWidth + Math.ceil(this.x) - pixelX;
   if (this.dy > 0)
   {
      var ground = this.layer.getTopSolidPixel(pixelX, pixelY + solidHeight, solidPixelWidth, proposedPixelY2 - pixelY, this.solidity);
      if (ground != MapLayer.noSolid)
      {
         this.dy = ground - solidHeight - this.y;
         hit = true;
      }
   }
   else if (this.dy < 0)
   {
      var ceiling = this.layer.getBottomSolidPixel(pixelX, proposedPixelY, solidPixelWidth, pixelY - proposedPixelY, this.solidity);
      if (ceiling != MapLayer.noSolid)
      {
         this.dy = ceiling + 1 - this.y;
         hit = true;
      }
   }

   proposedPixelY = Math.floor(this.y + this.dy);

   if (this.dx > 0)
   {
      var proposedPixelX2 = Math.ceil(this.x + this.dx);
      var pixelX2 = Math.ceil(this.x);
      var rightwall = this.layer.getLeftSolidPixel(pixelX2 + solidWidth, proposedPixelY, proposedPixelX2 - pixelX2, solidHeight, this.solidity);
      var hitWall = false;
      if (rightwall != MapLayer.noSolid)
      {
         var maxSlopeProposedY = Math.floor(this.y + this.dy - this.dx);
         var slopedFloor = this.layer.getTopSolidPixel(pixelX2 + solidWidth, maxSlopeProposedY + solidHeight, proposedPixelX2 - pixelX2, proposedPixelY - maxSlopeProposedY, this.solidity);
         if (slopedFloor != MapLayer.noSolid)
         {
            var ceiling = this.layer.getBottomSolidPixel(pixelX2, slopedFloor - solidHeight, solidWidth, proposedPixelY + solidHeight - slopedFloor, this.solidity);
            if ((ceiling == MapLayer.noSolid) && (this.ridingOn == null))
            {
               var rightwall2 = this.layer.getLeftSolidPixel(pixelX2 + solidWidth, slopedFloor - solidHeight, proposedPixelX2 - pixelX2, solidHeight, this.solidity);
               if (rightwall2 == MapLayer.noSolid)
                  this.dy = dyOrig = slopedFloor - solidHeight - 1 - this.y;
               else
                  hitWall = true;
            }
            else
               hitWall = true;
         }
         else
         {
            maxSlopeProposedY = Math.floor(this.y + this.dy + this.dx);
            var slopedCeiling = this.layer.getBottomSolidPixel(pixelX2 + solidWidth, proposedPixelY, proposedPixelX2 - pixelX2, maxSlopeProposedY - proposedPixelY, this.solidity);
            if (slopedCeiling != MapLayer.noSolid)
            {
               slopedCeiling++;
               var floor = this.layer.getTopSolidPixel(pixelX2, proposedPixelY + solidHeight, solidWidth, slopedCeiling - proposedPixelY, this.solidity);
               if ((floor == MapLayer.noSolid) && (this.ridingOn == null))
               {
                  var rightwall2 = this.layer.getLeftSolidPixel(pixelX2 + solidWidth, slopedCeiling, proposedPixelX2 - pixelX2, solidHeight, this.solidity);
                  if (rightwall2 == MapLayer.noSolid)
                     this.dy = dyOrig = slopedCeiling - this.y;
                  else
                     hitWall = true;
               }
               else
                  hitWall = true;
            }
            else
               hitWall = true;
         }
         if (hitWall)
         {
            this.dx = rightwall - solidWidth - this.x;
         }
         hit = true;
      }
   }
   else if (this.dx < 0)
   {
      var leftwall = this.layer.getRightSolidPixel(proposedPixelX, proposedPixelY, pixelX - proposedPixelX, solidHeight, this.solidity);
      var hitWall = false;
      if (leftwall != MapLayer.noSolid)
      {
         var maxSlopeProposedY = Math.floor(this.y + this.dy + this.dx);
         var slopedFloor = this.layer.getTopSolidPixel(proposedPixelX, maxSlopeProposedY + solidHeight, pixelX - proposedPixelX, proposedPixelY - maxSlopeProposedY, this.solidity);
         if (slopedFloor != MapLayer.noSolid)
         {
            var ceiling = this.layer.getBottomSolidPixel(pixelX, slopedFloor - solidHeight, solidWidth, proposedPixelY + solidHeight - slopedFloor, this.solidity);
            if ((ceiling == MapLayer.noSolid) && (this.ridingOn == null))
            {
               var leftwall2 = this.layer.getRightSolidPixel(proposedPixelX, slopedFloor - solidHeight, pixelX - proposedPixelX, solidHeight, this.solidity);
               if (leftwall2 == MapLayer.noSolid)
                  this.dy = dyOrig = slopedFloor - solidHeight - 1 - this.y;
               else
                  hitWall = true;
            }
            else
               hitWall = true;
         }
         else
         {
            maxSlopeProposedY = Math.floor(this.y + this.dy - this.dx);
            var slopedCeiling = this.layer.getBottomSolidPixel(proposedPixelX, proposedPixelY, pixelX - proposedPixelX, maxSlopeProposedY - proposedPixelY, this.solidity);
            if (slopedCeiling != MapLayer.noSolid)
            {
               slopedCeiling++;
               var floor = this.layer.getTopSolidPixel(pixelX, proposedPixelY + solidHeight, solidWidth, slopedCeiling - proposedPixelY, this.solidity);
               if ((floor == MapLayer.noSolid) && (this.ridingOn == null))
               {
                  var leftwall2 = this.layer.getRightSolidPixel(proposedPixelX, slopedCeiling, pixelX - proposedPixelX, solidHeight, this.solidity);
                  if (leftwall2 == MapLayer.noSolid)
                     this.dy = dyOrig = slopedCeiling - this.y;
                  else
                     hitWall = true;
               }
               else
                  hitWall = true;
            }
            else
               hitWall = true;
         }
         if (hitWall)
         {
            // Do integer arithmetic before double otherwise strange rounding seems to happen
            this.dx = leftwall + 1 - this.x;
         }
         hit = true;
      }
   }

   this.dy = dyOrig;
   proposedPixelX = Math.floor(this.x + this.dx);
   proposedPixelY = Math.floor(this.y + this.dy);
   var proposedSolidPixelWidth = solidWidth + Math.ceil(this.x + this.dx) - proposedPixelX;
   if (this.dy > 0)
   {
      proposedPixelY2 = Math.ceil(this.y + this.dy);
      var ground = this.layer.getTopSolidPixel(proposedPixelX, pixelY + solidHeight, proposedSolidPixelWidth, proposedPixelY2 - pixelY, this.solidity);
      if (ground != MapLayer.noSolid)
      {
         this.dy = ground - solidHeight - this.y;
         hit = true;
      }
   }
   else if (this.dy < 0)
   {
      var ceiling = this.layer.getBottomSolidPixel(proposedPixelX, proposedPixelY, proposedSolidPixelWidth, pixelY - proposedPixelY, this.solidity);
      if (ceiling != MapLayer.noSolid)
      {
         this.dy = ceiling + 1 - this.y;
         hit = true;
      }
   }

   if (hit && (this.localDX != null))
      this.localDX += this.dx - dxOrig;

   return hit;
};

Sprite.inputBits = { up:1, right:2, down:4, left:8, button1:16, button2:32, button3:64, button4:128 };
Sprite.prototype.mapPlayerToInputs = function(playerNum) {
   var p = players[playerNum - 1];
   this.oldInputs = this.inputs;
   this.inputs = 0;
   if (GeneralRules.playerPressButton(playerNum)) {
      if (p.up()) this.inputs |= Sprite.inputBits.up;
      if (p.left()) this.inputs |= Sprite.inputBits.left;
      if (p.right()) this.inputs |= Sprite.inputBits.right;
      if (p.down()) this.inputs |= Sprite.inputBits.down;
      if (p.button1()) this.inputs |= Sprite.inputBits.button1;
      if (p.button2()) this.inputs |= Sprite.inputBits.button2;
      if (p.button3()) this.inputs |= Sprite.inputBits.button3;
      if (p.button4()) this.inputs |= Sprite.inputBits.button4;
   }
};

Sprite.prototype.accelerateByInputs = function(acceleration, max, horizontalOnly) {
   if (!horizontalOnly) {
      if (0 != (this.inputs & Sprite.inputBits.up))
         this.dy -= acceleration / 10;
      if (this.dy < -max)
         this.dy = -max;
      if (0 != (this.inputs & Sprite.inputBits.down))
         this.dy += acceleration / 10;
      if (this.dy > max)
         this.dy = max;
   }
   if (this.localDX == null) {
      if (0 != (this.inputs & Sprite.inputBits.left))
         this.dx -= acceleration / 10;
      if (this.dx < -max)
         this.dx = -max;
      if (0 != (this.inputs & Sprite.inputBits.right))
         this.dx += acceleration / 10;
      if (this.dx > max)
         this.dx = max;
   } else {
      if (0 != (this.inputs & Sprite.inputBits.left))
         this.localDX -= acceleration / 10;
      if (this.localDX < -max)
         this.localDX = -max;
      if (0 != (this.inputs & Sprite.inputBits.right))
         this.localDX += acceleration / 10;
      if (this.localDX > max)
         this.localDX = max;
   }
};

Sprite.prototype.isInState = function(firstState, lastState) {
   return (this.state >= firstState) && (this.state <= lastState);
};

Sprite.prototype.moveByVelocity = function() {
   this.oldX = this.x;
   this.oldY = this.y;
   this.x += this.dx;
   this.y += this.dy;
};

Sprite.prototype.scrollSpriteIntoView = function(useScrollMargins) {
   this.layer.scrollSpriteIntoView(this, useScrollMargins);
};

Sprite.prototype.limitVelocity = function(maximum) {
   var useDX;
   if (this.localDX == null)
      useDX = this.dx;
   else
      useDX = this.localDX;
   var dist = useDX * useDX + this.dy * this.dy;
   if (dist > maximum * maximum) {
      dist = Math.sqrt(dist);
      useDX = useDX * maximum / dist;
      this.dy = this.dy * maximum / dist;
      if (this.localDX == null)
         this.dx = useDX;
      else
         this.localDX = useDX;
   }
}

Sprite.prototype.isOnTile = function(category, relativePosition) {
   var rp = this.getRelativePosition(relativePosition);
   var tile = this.layer.getTile(Math.floor(rp.x / this.layer.tileset.tileWidth), Math.floor(rp.y / this.layer.tileset.tileHeight));
   return category.isTileMember(this.layer.tileset, tile);
}

Sprite.prototype.rocketJump = function(category, speed) {
   if (!this.isActive)
      return;
   if (category == null)
      return;
   for(var idx = 0; idx < category.length; idx++) {
      var targetSprite = category[idx];
      if ((targetSprite == this) || (!targetSprite.isActive))
         continue;
      var x1 = Math.floor(this.x);
      var w1 = this.getSolidWidth();
      var x2 = Math.floor(targetSprite.x);
      var w2 = targetSprite.getSolidWidth();
      var y1 = Math.floor(this.y);
      var h1 = this.getSolidHeight();
      var y2 = Math.floor(targetSprite.y);
      var h2 = targetSprite.getSolidHeight();

      if ((x1 + w1 > x2) && (x2 + w2 > x1) && (y1 + h1 > y2) && (y2 + h2 > y1)) {
         var dx = (x1 + w1 / 2) - (x2 + w2 / 2);
         var dy = (y1 + h1 / 2) - (y2 + h2 / 2);
         var theta = Math.atan2(dy, dx);
         this.dx = speed * Math.cos(theta);
         this.dy = speed * Math.sin(theta);
      }
   }
   return;
}

Sprite.prototype.isTouchingCategory = function(category) {
   var touchIndex = this.testCollisionRect(category);
   return touchIndex !== -1;
}

Sprite.prototype.explodeTouchingTiles = function(category, replaceTile, spriteDefinition) {
   var rps = ["TopLeft", "TopCenter", "TopRight", "LeftMiddle", "CenterMiddle", "RightMiddle", "BottomLeft", "BottomCenter", "BottomRight"];
   for (var i=0; i<rps.length; i++) {
      var rp = this.getRelativePosition(rps[i]);
      var x = Math.floor(rp.x / this.layer.tileset.tileWidth);
      var y = Math.floor(rp.y / this.layer.tileset.tileHeight);
      var tile = this.layer.getTile(x, y);
      var isBreakable = category.isTileMember(this.layer.tileset, tile);
      if (isBreakable) {
         this.layer.setTile(x, y, replaceTile);
         this.addSpriteHere(spriteDefinition, rps[i], "CenterMiddle");
      }
   }
}

Sprite.prototype.getRelativePosition = function(relativePosition) {
   var rp = {x:Math.floor(this.x),y:Math.floor(this.y)};

   switch (relativePosition) {
      case "TopCenter":
         rp.x = Math.floor(this.x + this.getSolidWidth() / 2);
         break;
      case "TopRight":
         rp.x = Math.floor(this.x) + this.getSolidWidth() - 1;
         break;
      case "LeftMiddle":
         rp.y = Math.floor(this.y + this.getSolidHeight() / 2);
         break;
      case "CenterMiddle":
         rp.x = Math.floor(this.x + this.getSolidWidth() / 2);
         rp.y = Math.floor(this.y + this.getSolidHeight() / 2);
         break;
      case "RightMiddle":
         rp.x = Math.floor(this.x) + this.getSolidWidth() - 1;
         rp.y = Math.floor(this.y + this.getSolidHeight() / 2);
         break;
      case "BottomLeft":
         rp.y = Math.floor(this.y + this.getSolidHeight() - 1);
         break;
      case "BottomCenter":
         rp.x = Math.floor(this.x + this.getSolidWidth() / 2);
         rp.y = Math.floor(this.y + this.getSolidHeight() - 1);
         break;
      case "BottomRight":
         rp.x = Math.floor(this.x) + this.getSolidWidth() - 1;
         rp.y = Math.floor(this.y + this.getSolidHeight() - 1);
         break;
   }
   return rp;
}

Sprite.prototype.blocked = function(direction) {
   var solidPixelWidth;
   var solidPixelHeight;
   switch (direction)
   {
      case "Up":
         solidPixelWidth = this.getSolidWidth() + Math.ceil(this.x) - Math.floor(this.x);
         return this.layer.getBottomSolidPixel(Math.floor(this.x), Math.floor(this.y) - 1, solidPixelWidth, 1, this.solidity) != MapLayer.noSolid;
      case "Right":
         solidPixelHeight = this.getSolidHeight() + Math.ceil(this.y) - Math.floor(this.y);
         return this.layer.getLeftSolidPixel(Math.floor(this.x) + this.getSolidWidth(), Math.floor(this.y), 1, solidPixelHeight, this.solidity) != MapLayer.noSolid;
      case "Down":
         solidPixelWidth = this.getSolidWidth() + Math.ceil(this.x) - Math.floor(this.x);
         return this.layer.getTopSolidPixel(Math.floor(this.x), Math.floor(this.y) + this.getSolidHeight(), solidPixelWidth, 1, this.solidity) != MapLayer.noSolid;
      case "Left":
         solidPixelHeight = this.getSolidHeight() + Math.ceil(this.y) - Math.floor(this.y);
         return this.layer.getRightSolidPixel(Math.floor(this.x) - 1, Math.floor(this.y), 1, solidPixelHeight, this.solidity) != MapLayer.noSolid;
   }
   return false;
}

Sprite.prototype.isMoving = function(direction) {
   var useDX;
   if (this.localDX == null)
      useDX = this.dx;
   else
      useDX = this.localDX;

   switch (direction) {
      case "Left":
         return useDX < 0;
      case "Right":
         return useDX > 0;
      case "Up":
         return this.dy < 0;
      case "Down":
         return this.dy > 0;
   }
   return false;
}

Sprite.prototype.isInputPressed = function(input, initialOnly) {
   return (this.inputs & input) &&
      (!initialOnly || (0 == (this.oldInputs & input)));
}

Sprite.prototype.alterXVelocity = function(delta) {
   this.dx += delta;
}

Sprite.prototype.alterYVelocity = function(delta) {
   this.dy += delta;
}

Sprite.prototype.reactToInertia = function(retainPercentVertical, retainPercentHorizontal) {
   if (this.localDX == null) {
      if (Math.abs(this.dx) < .01)
         this.dx = 0;
      else
         this.dx *= retainPercentHorizontal / 100.0;
   } else {
      if (Math.abs(this.localDX) < .01)
         this.localDX = 0;
      else
         this.localDX *= retainPercentHorizontal / 100.0;
   }
   if (Math.abs(this.dy) < .01)
      this.dy = 0;
   else
      this.dy *= retainPercentVertical / 100.0;
}

Sprite.prototype.animate = function(correlation) {
   switch (correlation)
   {
      case "ByFrame":
         this.frame++;
         break;
      case "ByHorizontalVelocity":
         if (this.localDX == null)
            this.frame += Math.abs(Math.floor(this.x + this.dx) - Math.floor(this.x));
         else
            this.frame += Math.abs(Math.floor(this.localDX));
         break;
      case "ByVerticalVelocity":
         this.frame += Math.abs(Math.floor(this.y + this.dy) - Math.floor(this.y));
         break;
      case "ByVectorVelocity":
         var tmpDx = Math.abs(Math.floor(this.x + this.dx) - Math.floor(this.x));
         var tmpDy = Math.abs(Math.floor(this.y + this.dy) - Math.floor(this.y));
         this.frame += Math.floor(Math.sqrt(tmpDx * tmpDx + tmpDy * tmpDy));
         break;
   }
}

Sprite.prototype.isRidingPlatform = function() {
   return this.ridingOn != null;
}

Sprite.prototype.processRules = function() {
   if ((!this.processed) && (this.isActive)) {
      this.processed = true;
      if (this.executeRules != null) this.executeRules();
   }
}

Sprite.prototype.reactToPlatform = function() {
   if (this.ridingOn == null)
      return;

   if (!this.ridingOn.processed)
      this.ridingOn.processRules();

   if ((this.ridingOn.isActive == false) || (this.x + this.getSolidWidth() < this.ridingOn.oldX) || (this.x > this.ridingOn.oldX + this.ridingOn.getSolidWidth()) ||
      (this.y + this.getSolidHeight() < this.ridingOn.oldY - 1) || (this.y + this.getSolidHeight() >= this.ridingOn.oldY + this.ridingOn.getSolidHeight()))
   {
      this.stopRiding();
      return;
   }

   if (this.localDX != null)
      this.dx = this.localDX + this.ridingOn.dx;
   this.dy = this.ridingOn.y - this.getSolidHeight() - this.y;
}

Sprite.prototype.landDownOnPlatform = function(platformList) {
   if (this.ridingOn != null)
      return false;
   for(var sprKey in platformList) {
      var spr = platformList[sprKey];
      if (!spr.isActive)
         continue;
      if ((this.oldY + this.getSolidHeight() <= spr.oldY) &&
         (this.y + this.getSolidHeight() > spr.y) &&
         (this.x + this.getSolidWidth() > spr.x) &&
         (this.x < spr.x + spr.getSolidWidth()))
      {
         this.ridingOn = spr;
         spr.processRules();
         this.localDX = this.dx - spr.dx;
         this.dy = spr.y - this.getSolidHeight() - this.y;
         return true;
      }
   }
   return false;
}

Sprite.prototype.snapToGround = function(threshhold) {
   var proposedPixelX = Math.floor(this.x + this.dx);
   var proposedPixelY = Math.floor(this.y + this.dy);
   var proposedSolidPixelWidth = this.getSolidWidth() + Math.ceil(this.x + this.dx) - proposedPixelX;
   var ground = this.layer.getTopSolidPixel(proposedPixelX, proposedPixelY + this.getSolidHeight(), proposedSolidPixelWidth, threshhold, this.solidity);
   if (ground != MapLayer.noSolid) {
      newDy = ground - this.getSolidHeight() - this.y;
      if (newDy > this.dy)
         this.dy = newDy;
      return true;
   }
   return false;
}

Sprite.prototype.stopRiding = function() {
   this.localDX = null;
   this.ridingOn = null;
}

Sprite.prototype.switchToState = function(state, alignment) {
   var oldRect = {x:Math.floor(this.x), y:Math.floor(this.y), width:this.getSolidWidth(), height:this.getSolidHeight()};
   oldRect.bottom = oldRect.y + oldRect.height;
   oldRect.right = oldRect.x + oldRect.width;
   var newWidth = this.states[state].solidWidth;
   var newHeight = this.states[state].solidHeight;
   var newX, newY;
   switch (alignment) {
      case "TopCenter":
      case "CenterMiddle":
      case "BottomCenter":
         newX = this.x + (oldRect.width - newWidth) / 2;
         break;
      case "TopRight":
      case "RightMiddle":
      case "BottomRight":
         newX = this.x + oldRect.width - newWidth;
         break;
      default:
         newX = this.x;
         break;
   }
   switch (alignment) {
      case "LeftMiddle":
      case "CenterMiddle":
      case "RightMiddle":
         newY = this.y + (oldRect.height - newHeight) / 2;
         break;
      case "BottomLeft":
      case "BottomCenter":
      case "BottomRight":
         newY = this.y + oldRect.height - newHeight;
         break;
      default:
         newY = this.y;
         break;
   }

   if ((Math.ceil(newY + newHeight) > oldRect.bottom) && (this.layer.getTopSolidPixel(
      Math.floor(newX), oldRect.bottom, newWidth, Math.ceil(newY) + newHeight - oldRect.bottom, this.solidity) != MapLayer.noSolid))
      return false;

   if ((Math.floor(newY) < oldRect.y) && (this.layer.getBottomSolidPixel(
      Math.floor(newX), Math.floor(newY), newWidth, oldRect.y - Math.floor(newY), this.solidity) != MapLayer.noSolid))
      return false;

   if ((Math.floor(newX) < oldRect.x) && (this.layer.getRightSolidPixel(
      Math.floor(newX), Math.floor(newY), oldRect.x - Math.floor(newX), newHeight, this.solidity) != MapLayer.noSolid))
      return false;

   if ((Math.ceil(newX + newWidth) > oldRect.right) && (this.layer.getLeftSolidPixel(
      oldRect.right, Math.floor(newY), Math.ceil(newX) + newWidth - oldRect.right, newHeight, this.solidity) != MapLayer.noSolid))
      return false;

   this.x = newX;
   this.y = newY;
   this.state = state;
   return true;
}

Sprite.prototype.deactivate = function() {
   this.isActive = false;
}

Sprite.prototype.touchTiles = function(category) {
   if (this.touchedTiles != null)
      this.touchedTiles.length = 0;

   var tw = this.layer.tileset.tileWidth;
   var th = this.layer.tileset.tileHeight;
   var minYEdge = Math.floor(Math.floor(this.y) / th);
   var maxY = Math.floor((Math.floor(this.y) + this.getSolidHeight()) / th);
   if (maxY >= this.layer.virtualRows)
      maxY = this.layer.virtualRows - 1;
   var maxYEdge = Math.floor((Math.floor(this.y) + this.getSolidHeight() - 1) / th);
   var minX = Math.floor(Math.floor(this.x - 1) / tw);
   var minXEdge = Math.floor(Math.floor(this.x) / tw);
   var maxX = Math.floor((Math.floor(this.x) + this.getSolidWidth()) / tw);
   if (maxX >= this.layer.virtualColumns)
      maxX = this.layer.virtualColumns - 1;
   var maxXEdge = Math.floor((Math.floor(this.x) + this.getSolidWidth() - 1) / tw);
   for (var yidx = Math.floor((Math.floor(this.y) - 1) / th); yidx <= maxY; yidx++) {
      var isYEdge = !((yidx >= minYEdge) && (yidx <= maxYEdge));
      for (var xidx = (isYEdge ? minXEdge : minX);
         xidx <= (isYEdge ? maxXEdge : maxX);
         xidx++)
      {
         if (category.isTileMember(this.layer.tileset, this.layer.getTile(xidx, yidx))) {
            var wasTouching;
            var oldPixelX = Math.floor(this.oldX);
            var oldPixelY = Math.floor(this.oldY);

            if ((oldPixelX <= xidx * tw + tw) &&
               (oldPixelX + this.getSolidWidth() >= xidx * tw) &&
               (oldPixelY <= yidx * th + th) &&
               (oldPixelY + this.getSolidHeight() >= yidx * th))
            {
               var edgeX = (oldPixelX + this.getSolidWidth() == xidx * tw) ||
                  (oldPixelX == xidx * tw + tw);
               var edgeY = (oldPixelY + this.getSolidHeight() == yidx * th) ||
                  (oldPixelY == yidx * th + th);
               if (edgeX && edgeY)
                  wasTouching = false;
               else
                  wasTouching = true;
            }
            else
               wasTouching = false;
            
            if (this.touchedTiles == null)
               this.touchedTiles = [];
            this.touchedTiles.push({x:xidx, y:yidx, tileValue:this.layer.getTile(xidx, yidx), initial:!wasTouching, processed:false});
         }
      }
   }
   if (this.touchedTiles == null)
      return false;
   return this.touchedTiles.length > 0;
};

Sprite.prototype.tileTake = function(tileValue, counter, newValue) {
   if (this.touchedTiles == null)
      return 0;

   var result = 0;

   for (var i = 0; i < this.touchedTiles.length; i++) {
      var tt = this.touchedTiles[i];
      if ((tt.tileValue == tileValue) && (!tt.processed)) {
         if (counter.value < counter.max) {
            counter.value++;
            this.layer.setTile(tt.x, tt.y, tt.tileValue = newValue);
            tt.processed = true;
            result++;
         }
         else
            break;
      }
   }
   return result;
};

Sprite.prototype.tileAddSprite = function (touchingIndex, spriteDefinition) {
   var tt = this.touchedTiles[touchingIndex];
   var spriteParams = "{\"~1\":\"" + spriteDefinition + "\", \"x\":" +
   tt.x * this.layer.tileset.tileWidth + ",\"y\":" + tt.y * this.layer.tileset.tileHeight +
   ",\"dx\":0,\"dy\":0,\"state\":0,\"frame\":0,\"active\":true,\"priority\":0,\"solidityName\":\"" +
   solidity.getSolidityName(this.solidity) + "\"}";
   GeneralRules.lastCreatedSprite = Sprite.deserialize(this.layer, spriteParams);
   GeneralRules.lastCreatedSprite.isDynamic = true;
   GeneralRules.lastCreatedSprite.clearParameters();

   this.layer.sprites.push(GeneralRules.lastCreatedSprite);
   for(var categoryKey in spriteDefinitions[spriteDefinition].prototype.categories) {
      var category = spriteDefinitions[spriteDefinition].prototype.categories[categoryKey];
      if (this.layer.spriteCategories[category] == null)
         this.layer.spriteCategories[category] = [];
      this.layer.spriteCategories[category].push(GeneralRules.lastCreatedSprite);
   }
};

Sprite.prototype.tileActivateSprite = function(touchingIndex, category, clearParameters) {
   for (var i = 0; i < category.length; i++) {
      if (!category[i].isActive) {
         category[i].isActive = true;
         var tt = this.touchedTiles[touchingIndex];
         category[i].x = tt.x * this.layer.tileset.tileWidth;
         category[i].y = tt.y * this.layer.tileset.tileHeight;
         if (clearParameters) {
            category[i].frame = 0;
            category[i].state = 0;
            category[i].clearParameters();
         }
         category[i].processRules();
         return i;
      }
   }
   return -1;
};

Sprite.prototype.clearParameters = function() {
   if (this.constructor.userParams == null) return;
   for(i in this.constructor.userParams) {
      this[this.constructor.userParams[i]] = 0;
   }
};

Sprite.prototype.setSolidity = function(solidity) {
   this.solidity = solidity;
};

Sprite.prototype.testCollisionRect = function(targets) {
   if (!this.isActive)
      return -1;
   if (targets == null)
      return -1;
   for(var idx = 0; idx < targets.length; idx++) {
      var targetSprite = targets[idx];
      if ((targetSprite == this) || (!targetSprite.isActive))
         continue;
      var x1 = Math.floor(this.x);
      var w1 = this.getSolidWidth();
      var x2 = Math.floor(targetSprite.x);
      var w2 = targetSprite.getSolidWidth();
      var y1 = Math.floor(this.y);
      var h1 = this.getSolidHeight();
      var y2 = Math.floor(targetSprite.y);
      var h2 = targetSprite.getSolidHeight();

      if ((x1 + w1 > x2) && (x2 + w2 > x1) && (y1 + h1 > y2) && (y2 + h2 > y1))
         return idx;
   }
   return -1;
};

Sprite.prototype.getNearestSpriteIndex = function(target) {
   var minDist = 999999999;
   var result = -1;
   if (target == null) return -1;
   for (var i = 0; i < target.length; i++) {
      if ((!target[i].isActive) || (target[i] == this))
         continue;
      var xOff = target[i].x - this.x;
      var yOff = target[i].y - this.y;
      var dist = xOff * xOff + yOff * yOff;
      if (dist < minDist) {
         minDist = dist;
         result = i;
      }
   }
   return result;
};

Sprite.prototype.pushTowardCategory = function(target, index, force) {
   if (index < 0)
      index = this.getNearestSpriteIndex(target);
   if (index < 0)
      return false;

   return this.pushTowardSprite(target[index], force);
};

Sprite.prototype.pushTowardSprite = function (target, force) {
   var vx = target.x - this.x + (target.getSolidWidth() - this.getSolidWidth()) / 2;
   var vy = target.y - this.y + (target.getSolidHeight() - this.getSolidHeight()) / 2;
   var dist = Math.sqrt(vx * vx + vy * vy);
   if (dist >= 1) {
      this.dx += vx * force / dist / 10.0;
      this.dy += vy * force / dist / 10.0;
      return true;
   }
   return false;
};

Sprite.prototype.setInputState = function(input, press) {
   if (press)
      this.inputs |= input;
   else
      this.inputs &= ~input;
};

Sprite.prototype.clearInputs = function(setOldInputs) {
   if (setOldInputs)
      this.oldInputs = this.inputs;
   this.inputs = 0;
};

Sprite.prototype.tileUseUp = function(tileValue, counter, newValue) {
   if (this.touchedTiles == null)
      return 0;

   var result = 0;

   for (var i = 0; i < this.touchedTiles.length; i++) {
      var tt = this.touchedTiles[i];
      if ((tt.tileValue == tileValue) && (!tt.processed)) {
         if (counter.value > 0) {
            counter.value--;
            this.layer.setTile(tt.x, tt.y, tt.tileValue = newValue);
            tt.processed = true;
            result++;
         }
         else
            break;
      }
   }
   return result;
};

Sprite.prototype.addSpriteHere = function(spriteDefinition, location, hotSpot) {
   var spriteParams = "{\"~1\":\"" + spriteDefinition + "\", \"x\":0,\"y\":0" +
   ",\"dx\":0,\"dy\":0,\"state\":0,\"frame\":0,\"active\":true,\"priority\":0,\"solidityName\":\"" +
   solidity.getSolidityName(this.solidity) + "\"}";
   GeneralRules.lastCreatedSprite = Sprite.deserialize(this.layer, spriteParams);

   ptLocation = this.getRelativePosition(location);
   ptHotSpot = GeneralRules.lastCreatedSprite.getRelativePosition(hotSpot);
   GeneralRules.lastCreatedSprite.x = GeneralRules.lastCreatedSprite.oldX = ptLocation.x - ptHotSpot.x;
   GeneralRules.lastCreatedSprite.y = GeneralRules.lastCreatedSprite.oldY = ptLocation.y - ptHotSpot.y;

   GeneralRules.lastCreatedSprite.isDynamic = true;
   GeneralRules.lastCreatedSprite.clearParameters();

   this.layer.sprites.push(GeneralRules.lastCreatedSprite);
   for(var categoryKey in spriteDefinitions[spriteDefinition].prototype.categories) {
      var category = spriteDefinitions[spriteDefinition].prototype.categories[categoryKey];
      if (this.layer.spriteCategories[category] == null)
         this.layer.spriteCategories[category] = [];
      this.layer.spriteCategories[category].push(GeneralRules.lastCreatedSprite);
   }
};

Sprite.prototype.tileChange = function(oldTileValue, newTileValue, initialOnly) {
   if (this.touchedTiles == null)
      return 0;

   var result = 0;

   for (var i = 0; i < this.touchedTiles.length; i++) {
      var tt = this.touchedTiles[i];
      if ((tt.tileValue == oldTileValue) && (!tt.processed) && (!initialOnly || tt.initial)) {
         tt.processed = true;
         this.layer.setTile(tt.x, tt.y, tt.tileValue = newTileValue);
         result++;
      }
   }
   return result;
};

Sprite.prototype.tileChangeTouched = function(touchingIndex, newTileValue) {
   if ((this.touchedTiles == null) || (this.touchedTiles.length <= touchingIndex))
      return;

   var tt = this.touchedTiles[touchingIndex];
   tt.tileValue =  newTileValue;
   this.layer.setTile(tt.x, tt.y, tt.tileValue);
};

Sprite.prototype.tileTouchingIndex = function(tileValue, initialOnly, markAsProcessed) {
   if (this.touchedTiles == null)
      return -1;

   for (var i = 0; i < this.touchedTiles.length; i++) {
      var tt = this.touchedTiles[i];
      if ((tt.tileValue == tileValue) && (!tt.processed) && (!initialOnly || tt.initial)) {
         tt.processed = markAsProcessed;
         return i;
      }
   }

   return -1;
};

Sprite.prototype.mapMouseToSprite = function(instantMove, hotSpot) {
   var pos = {x:mouseInfo.x - this.layer.currentX, y:mouseInfo.y - this.layer.currentY};
   var rp = this.getRelativePosition(hotSpot);
   if (instantMove) {
      this.oldX = this.x;
      this.oldY = this.y;
      this.x = pos.x + this.x - rp.x;
      this.y = pos.y + this.y - rp.y;
   } else {
      this.dx = pos.x - rp.x;
      this.dy = pos.y - rp.y;
   }
   this.oldinputs = this.inputs;
   this.inputs = 0;
   if (mouseInfo.pressed)
      this.inputs |= Sprite.inputBits.button1;
};

Sprite.prototype.setInputsTowardSprite = function(target) {
   var targetCenter = target.x + target.getSolidWidth() / 2;
   var myCenter = this.x + this.getSolidWidth() / 2;

   if (targetCenter < myCenter)
      this.inputs |= Sprite.inputBits.left;
   else if (targetCenter > myCenter)
      this.inputs |= Sprite.inputBits.right;
   else
      this.inputs &= ~(Sprite.inputBits.left | Sprite.inputBits.right);

   targetCenter = target.y + target.getSolidHeight() / 2;
   myCenter = this.y + this.getSolidHeight() / 2;
   if (targetCenter < myCenter)
      this.inputs |= Sprite.inputBits.up;
   else if (targetCenter > myCenter)
      this.inputs |= Sprite.inputBits.down;
   else
      this.inputs &= ~(Sprite.inputBits.up | Sprite.inputBits.down);
};

Sprite.prototype.setInputsTowardCategory = function(target, index) {
   if (index < 0)
      index = this.getNearestSpriteIndex(target);
   if (index < 0)
   {
      this.inputs &= ~(Sprite.inputBits.left | Sprite.inputBits.right | Sprite.inputBits.up | Sprite.inputBits.down);
      return;
   }

   this.setInputsTowardSprite(target[index]);
};

var spriteDefinitions = new Object();
spriteDefinitions.Balloon = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, Counter) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.Counter = Counter
};
spriteDefinitions.Balloon.prototype = new Sprite();
spriteDefinitions.Balloon.prototype.constructor = spriteDefinitions.Balloon;
spriteDefinitions.Balloon.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Balloon(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.Counter);
}
spriteDefinitions.Balloon.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Balloon.prototype.toJSON = function() {
   return {"~1":"Balloon",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),Counter:this.Counter};
}
spriteDefinitions.Balloon.userParams = ["Counter"];
spriteDefinitions.Balloon.prototype.states = new Array();
spriteDefinitions.Balloon.prototype.categories = ["Explodable"];
spriteDefinitions.Balloon.prototype.states[0] = new SpriteState(28,52,"Balloon",{x:0,y:0,width:28,height:52},[new TileFrame(1,0)]);
spriteDefinitions.Balloon.statesEnum = {Balloon: 0};
spriteDefinitions.Balloon.prototype.executeRules = function() {
   // Increment Counter
   this.Counter = ((this.Counter) + (1));
   // Set dy
   this.dy = Math.sin(this.Counter / 20) / 2;
   // Set dx
   this.dx = -1;
   // MoveByVelocity
   this.moveByVelocity();
   
};
spriteDefinitions.Bomb = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, Counter) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.Counter = Counter
};
spriteDefinitions.Bomb.prototype = new Sprite();
spriteDefinitions.Bomb.prototype.constructor = spriteDefinitions.Bomb;
spriteDefinitions.Bomb.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Bomb(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.Counter);
}
spriteDefinitions.Bomb.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Bomb.prototype.toJSON = function() {
   return {"~1":"Bomb",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),Counter:this.Counter};
}
spriteDefinitions.Bomb.userParams = ["Counter"];
spriteDefinitions.Bomb.prototype.states = new Array();
spriteDefinitions.Bomb.prototype.states[0] = new SpriteState(20,20,"Bomb",{x:0,y:0,width:20,height:20},[new TileFrame(1,0)]);
spriteDefinitions.Bomb.prototype.states[1] = new SpriteState(20,20,"Bomb",{x:0,y:0,width:20,height:20},[new TileFrame(10,0),new TileFrame(20,1)]);
spriteDefinitions.Bomb.prototype.states[2] = new SpriteState(20,20,"Bomb",{x:0,y:0,width:20,height:20},[new TileFrame(3,0),new TileFrame(6,2)]);
spriteDefinitions.Bomb.prototype.states[3] = new SpriteState(20,20,"Bomb",{x:0,y:0,width:20,height:20},[new TileFrame(10,0),new TileFrame(20,1),new TileFrame(30,2),new TileFrame(40,1)]);
spriteDefinitions.Bomb.statesEnum = {Bomb1: 0,Bomb2: 1,Bomb4: 2,Bomb3: 3};
spriteDefinitions.Bomb.prototype.executeRules = function() {
   // If Initial
   if ((this.isInState(spriteDefinitions.Bomb.statesEnum.Bomb1, spriteDefinitions.Bomb.statesEnum.Bomb1) 
            && ((this.Counter) == (0)))) {
      // Initialize Velocity
      this.pushTowardCategory(this.layer.spriteCategories.Cursor, -1, 100);
   }
   // IncrementCounter
   this.Counter = ((this.Counter) + (1));
   // Animate
   this.animate("ByFrame");
   // Gravity
   this.alterYVelocity(0.2);
   // If Blocked down
   if (this.blocked("Down")) {
      // ReactToInertia
      this.reactToInertia(100, 85);
   }
   // ReactToSolid
   this.reactToSolid();
   // MoveByVelocity
   this.moveByVelocity();
   // If Counter > 60
   if (((this.Counter) > (60))) {
      // If IsInState 4
      if (this.isInState(spriteDefinitions.Bomb.statesEnum.Bomb4, spriteDefinitions.Bomb.statesEnum.Bomb4)) {
         // AddSpriteHere Explosion 5
         this.addSpriteHere("Explosion", "CenterMiddle", "CenterMiddle");
         // Deactivate
         this.deactivate();
      }
      // Reset Counter
      this.Counter = 1;
      // Increment State
      this.state = ((this.state) + (1));
   }
   
};
spriteDefinitions.Cursor = function(layer, x, y, dx, dy, state, frame, active, priority, solidity) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
};
spriteDefinitions.Cursor.prototype = new Sprite();
spriteDefinitions.Cursor.prototype.constructor = spriteDefinitions.Cursor;
spriteDefinitions.Cursor.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Cursor(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName]);
}
spriteDefinitions.Cursor.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Cursor.prototype.toJSON = function() {
   return {"~1":"Cursor",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity)};
}
spriteDefinitions.Cursor.userParams = [];
spriteDefinitions.Cursor.prototype.states = new Array();
spriteDefinitions.Cursor.prototype.categories = ["Cursor"];
spriteDefinitions.Cursor.prototype.states[0] = new SpriteState(36,36,"Cursor",{x:0,y:0,width:36,height:36},[new TileFrame(1,0)]);
spriteDefinitions.Cursor.statesEnum = {Cursor: 0};
spriteDefinitions.Cursor.prototype.executeRules = function() {
   // FollowMouse
   this.mapMouseToSprite(true, "CenterMiddle");
   
};
spriteDefinitions.Explosion = function(layer, x, y, dx, dy, state, frame, active, priority, solidity) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
};
spriteDefinitions.Explosion.prototype = new Sprite();
spriteDefinitions.Explosion.prototype.constructor = spriteDefinitions.Explosion;
spriteDefinitions.Explosion.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Explosion(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName]);
}
spriteDefinitions.Explosion.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Explosion.prototype.toJSON = function() {
   return {"~1":"Explosion",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity)};
}
spriteDefinitions.Explosion.userParams = [];
spriteDefinitions.Explosion.prototype.states = new Array();
spriteDefinitions.Explosion.prototype.categories = ["Explosion","Explodable"];
spriteDefinitions.Explosion.prototype.states[0] = new SpriteState(32,32,"Explosion",{x:0,y:0,width:32,height:32},[new TileFrame(3,0),new TileFrame(6,1),new TileFrame(9,2),new TileFrame(12,3),new TileFrame(15,4),new TileFrame(18,5),new TileFrame(21,6),new TileFrame(24,7)]);
spriteDefinitions.Explosion.statesEnum = {Explosion: 0};
spriteDefinitions.Explosion.prototype.executeRules = function() {
   // Animate
   this.animate("ByFrame");
   // explodeTouchingTiles
   this.explodeTouchingTiles(tileCategories.Breakable, 0, "Explosion");
   // Rule 1
   if (((this.frame) >= (23))) {
      // Rule 2
      this.deactivate();
   }
   
};
spriteDefinitions.Missile = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, CollisionIndex, Init) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.CollisionIndex = CollisionIndex
   this.Init = Init
};
spriteDefinitions.Missile.prototype = new Sprite();
spriteDefinitions.Missile.prototype.constructor = spriteDefinitions.Missile;
spriteDefinitions.Missile.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Missile(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.CollisionIndex,source.Init);
}
spriteDefinitions.Missile.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Missile.prototype.toJSON = function() {
   return {"~1":"Missile",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),CollisionIndex:this.CollisionIndex,Init:this.Init};
}
spriteDefinitions.Missile.userParams = ["CollisionIndex","Init"];
spriteDefinitions.Missile.prototype.states = new Array();
spriteDefinitions.Missile.prototype.states[0] = new SpriteState(20,20,"Bomb",{x:0,y:0,width:20,height:20},[new TileFrame(4,0),new TileFrame(8,1),new TileFrame(12,2)]);
spriteDefinitions.Missile.statesEnum = {Missile: 0};
spriteDefinitions.Missile.prototype.executeRules = function() {
   // If Initial
   if (((this.Init) == (0))) {
      // Rule 1
      this.Init = 1;
      // Initialize Velocity
      this.pushTowardCategory(this.layer.spriteCategories.Cursor, -1, 100);
   }
   // Animate
   this.animate("ByFrame");
   // Gravity
   this.alterYVelocity(0.2);
   // ReactToSolid
   this.reactToSolid();
   // MoveByVelocity
   this.moveByVelocity();
   // TestCollisionRect
   this.CollisionIndex = this.testCollisionRect(this.layer.spriteCategories.Explodable);
   // If blocked
   if (((((this.blocked("Up") || this.blocked("Right")) 
            || this.blocked("Down")) 
            || this.blocked("Left")) 
            || ((this.CollisionIndex) != (-1)))) {
      // AddSpriteHere
      this.addSpriteHere("Explosion", "CenterMiddle", "CenterMiddle");
      // Deactivate
      this.deactivate();
   }
   
};
spriteDefinitions.Tank = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, EnemyIndex) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.EnemyIndex = EnemyIndex
};
spriteDefinitions.Tank.prototype = new Sprite();
spriteDefinitions.Tank.prototype.constructor = spriteDefinitions.Tank;
spriteDefinitions.Tank.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Tank(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.EnemyIndex);
}
spriteDefinitions.Tank.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Tank.prototype.toJSON = function() {
   return {"~1":"Tank",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),EnemyIndex:this.EnemyIndex};
}
spriteDefinitions.Tank.userParams = ["EnemyIndex"];
spriteDefinitions.Tank.prototype.states = new Array();
spriteDefinitions.Tank.prototype.categories = ["Tank"];
spriteDefinitions.Tank.prototype.states[0] = new SpriteState(56,32,"Tank",{x:0,y:0,width:56,height:32},[new TileFrame(5,0),new TileFrame(10,1)]);
spriteDefinitions.Tank.prototype.states[1] = new SpriteState(56,32,"Tank",{x:0,y:0,width:56,height:32},[new TileFrame(5,2),new TileFrame(10,3)]);
spriteDefinitions.Tank.prototype.states[2] = new SpriteState(32,32,"Balloon",{x:0,y:0,width:0,height:0},null);
spriteDefinitions.Tank.statesEnum = {Right: 0,Left: 1,New_Sprite_State_1: 2};
spriteDefinitions.Tank.prototype.executeRules = function() {
   // If IsInState Right
   if ((this.isInState(spriteDefinitions.Tank.statesEnum.Right, spriteDefinitions.Tank.statesEnum.Right) 
            && ((this.dx) <= (1)))) {
      // And Blocked down
      if (this.blocked("Down")) {
         // AlterXVelocity 0.1
         this.alterXVelocity(0.1);
      }
      else {
         // AlterXVelocity
         this.alterXVelocity(0.05);
      }
   }
   // Gravity
   this.alterYVelocity(0.2);
   // ReactToInertia
   this.reactToInertia(100, 99);
   // Animate
   this.animate("ByFrame");
   // rocketJump
   this.rocketJump(this.layer.spriteCategories.Explosion, 5);
   // ReactToSolid
   this.reactToSolid();
   // MoveByVelocity
   this.moveByVelocity();
   // ScrollSpriteIntoView
   this.scrollSpriteIntoView(true);
   // Rule 7
   counters.MissileEnergyRechargeTimer.value = ((counters.MissileEnergyRechargeTimer.value) + (1));
   // Rule 5
   if ((((counters.MissileEnergy.value) < (counters.MissileEnergy.max)) 
            && ((counters.MissileEnergyRechargeTimer.value) > (50)))) {
      // Rule 4
      counters.MissileEnergy.value = ((counters.MissileEnergy.value) + (1));
   }
   // If mouse clicked
   if ((this.clicked() 
            && ((counters.MissileEnergy.value) >= (counters.EnergyCostPerMissile.value)))) {
      // Rule 3
      counters.MissileEnergy.value = ((counters.MissileEnergy.value) - (counters.EnergyCostPerMissile.value));
      // Rule 8
      counters.MissileEnergyRechargeTimer.value = 0;
      // Create Bomb
      this.addSpriteHere("Missile", "CenterMiddle", "CenterMiddle");
   }
   // TestCollisionRect
   this.EnemyIndex = this.testCollisionRect(this.layer.spriteCategories.Enemy);
   // Rule 11
   if (((-1) != (this.EnemyIndex))) {
      // Rule 9
      this.EnemyIndex = -1;
      // Rule 10
      this.y = 480;
   }
   
};
spriteDefinitions.Zombie = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, Speed) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.Speed = Speed
};
spriteDefinitions.Zombie.prototype = new Sprite();
spriteDefinitions.Zombie.prototype.constructor = spriteDefinitions.Zombie;
spriteDefinitions.Zombie.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.Zombie(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.Speed);
}
spriteDefinitions.Zombie.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.Zombie.prototype.toJSON = function() {
   return {"~1":"Zombie",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),Speed:this.Speed};
}
spriteDefinitions.Zombie.userParams = ["Speed"];
spriteDefinitions.Zombie.prototype.states = new Array();
spriteDefinitions.Zombie.prototype.categories = ["Explodable","Enemy"];
spriteDefinitions.Zombie.prototype.states[0] = new SpriteState(20,36,"Zombie",{x:0,y:0,width:20,height:36},[new TileFrame(5,0),new TileFrame(10,1),new TileFrame(15,2)]);
spriteDefinitions.Zombie.prototype.states[1] = new SpriteState(20,36,"Zombie",{x:0,y:0,width:20,height:36},[new TileFrame(5,4),new TileFrame(10,5),new TileFrame(15,6)]);
spriteDefinitions.Zombie.prototype.states[2] = new SpriteState(20,36,"Zombie",{x:0,y:0,width:20,height:36},[new TileFrame(5,3),new TileFrame(10,7)]);
spriteDefinitions.Zombie.statesEnum = {Left: 0,Right: 1,Falling: 2};
spriteDefinitions.Zombie.prototype.executeRules = function() {
   // Rule 1
   if (((this.Speed) == (0))) {
      // Rule 2
      this.Speed = Math.random() * 0.5 + 0.75;
   }
   // If IsInState Falling
   if ((this.isInState(spriteDefinitions.Zombie.statesEnum.Falling, spriteDefinitions.Zombie.statesEnum.Falling) && this.blocked("Down"))) {
      // SwitchToState Left after falling
      this.switchToState(spriteDefinitions.Zombie.statesEnum.Left, "TopLeft");
   }
   // If IsInState Left
   if (this.isInState(spriteDefinitions.Zombie.statesEnum.Left, spriteDefinitions.Zombie.statesEnum.Left)) {
      // Set dx -1
      this.dx = -this.Speed;
      // If blocked left
      if ((this.blocked("Left") 
               && ((this.dx) == (0)))) {
         // SwitchToState Right
         this.switchToState(spriteDefinitions.Zombie.statesEnum.Right, "TopLeft");
      }
   }
   else {
      // If IsInState Right
      if (this.isInState(spriteDefinitions.Zombie.statesEnum.Right, spriteDefinitions.Zombie.statesEnum.Right)) {
         // Set dx 1
         this.dx = this.Speed;
         // If blocked right
         if ((this.blocked("Right") 
                  && ((this.dx) == (0)))) {
            // SwitchToState Left
            this.switchToState(spriteDefinitions.Zombie.statesEnum.Left, "TopLeft");
         }
      }
   }
   // Gravity
   this.alterYVelocity(0.1);
   // Animate
   this.animate("ByHorizontalVelocity");
   // If not blocked down
   if ((this.blocked("Down") == false)) {
      // SwitchToState falling
      this.switchToState(spriteDefinitions.Zombie.statesEnum.Falling, "TopLeft");
   }
   // ReactToSolid
   this.reactToSolid();
   // MoveByVelocity
   this.moveByVelocity();
   // if isTouchingCategory explosion
   if (this.isTouchingCategory(this.layer.spriteCategories.Explosion)) {
      // AddSpriteHere dead zombie
      this.addSpriteHere("ZombieDead", "TopLeft", "TopLeft");
      // Deactivate
      this.deactivate();
   }
   
};
spriteDefinitions.ZombieDead = function(layer, x, y, dx, dy, state, frame, active, priority, solidity) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
};
spriteDefinitions.ZombieDead.prototype = new Sprite();
spriteDefinitions.ZombieDead.prototype.constructor = spriteDefinitions.ZombieDead;
spriteDefinitions.ZombieDead.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.ZombieDead(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName]);
}
spriteDefinitions.ZombieDead.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.ZombieDead.prototype.toJSON = function() {
   return {"~1":"ZombieDead",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity)};
}
spriteDefinitions.ZombieDead.userParams = [];
spriteDefinitions.ZombieDead.prototype.states = new Array();
spriteDefinitions.ZombieDead.prototype.states[0] = new SpriteState(20,36,"Zombie",{x:0,y:0,width:20,height:36},[new TileFrame(5,8),new TileFrame(10,9),new TileFrame(15,10),new TileFrame(65,11)]);
spriteDefinitions.ZombieDead.statesEnum = {New_Sprite_State_1: 0};
spriteDefinitions.ZombieDead.prototype.executeRules = function() {
   // Animate
   this.animate("ByFrame");
   // Rule 1
   if (((this.frame) > (20))) {
      // Rule 2
      this.deactivate();
   }
   
};
spriteDefinitions.ZombieSpawner = function(layer, x, y, dx, dy, state, frame, active, priority, solidity, Counter, NumberToSpawn) {
   Sprite.call(this, layer, x, y, dx, dy, state, frame, active, priority, solidity);
   this.Counter = Counter
   this.NumberToSpawn = NumberToSpawn
};
spriteDefinitions.ZombieSpawner.prototype = new Sprite();
spriteDefinitions.ZombieSpawner.prototype.constructor = spriteDefinitions.ZombieSpawner;
spriteDefinitions.ZombieSpawner.deserialize = function(layer, data) {
   var source = JSON.parse(data);
   return result = new spriteDefinitions.ZombieSpawner(layer, source.x, source.y, source.dx, source.dy, source.state, source.frame, source.active, source.priority, solidity[source.solidityName],source.Counter,source.NumberToSpawn);
}
spriteDefinitions.ZombieSpawner.prototype.serialize = function() {
   return JSON.stringify(this);
}
spriteDefinitions.ZombieSpawner.prototype.toJSON = function() {
   return {"~1":"ZombieSpawner",x:this.x,y:this.y,dx:this.dx,dy:this.dy,state:this.state,frame:this.frame,active:this.isActive,priority:this.priority,solidityName:solidity.getSolidityName(this.solidity),Counter:this.Counter,NumberToSpawn:this.NumberToSpawn};
}
spriteDefinitions.ZombieSpawner.userParams = ["Counter","NumberToSpawn"];
spriteDefinitions.ZombieSpawner.prototype.states = new Array();
spriteDefinitions.ZombieSpawner.prototype.states[0] = new SpriteState(32,32,"Zombie",{x:0,y:0,width:20,height:36},[new TileFrame(1,0)]);
spriteDefinitions.ZombieSpawner.statesEnum = {Initial: 0};
spriteDefinitions.ZombieSpawner.prototype.executeRules = function() {
   // Hide
   this.hidden = 0;
   // If time to trigger
   if (((this.x - this.layer.spriteCategories.Tank[0].x) < (600))) {
      // set counter =1 to 6
      this.Counter = Math.random() * 5 + 1;
      // while counter > 0
      for (
      ; ((this.Counter) > (0)); 
      ) {
         // Decrement counter
         this.Counter = ((this.Counter) - (1));
         // AddSpriteHere
         this.addSpriteHere("Zombie", "TopLeft", "TopLeft");
         // Randomize position
         GeneralRules.lastCreatedSprite.x = ((Math.random() * 60 - 30) + (this.x));
      }
      // Deactivate
      this.deactivate();
   }
   
};
function TileShape()
{
}

TileShape.maxValue = 32767;
TileShape.minValue = -32768;

TileShape.empty = new TileShape();
TileShape.empty.getTopSolidPixel = function(width, height, min, max) { return TileShape.maxValue; };
TileShape.empty.getLeftSolidPixel = function(width, height, min, max) { return TileShape.maxValue; };
TileShape.empty.getRightSolidPixel = function(width, height, min, max) { return TileShape.minValue; };
TileShape.empty.getBottomSolidPixel = function(width, height, min, max) { return TileShape.minValue; };

TileShape.solid = new TileShape();
TileShape.prototype.getTopSolidPixel = function(width, height, min, max) { return 0; };
TileShape.prototype.getLeftSolidPixel = function(width, height, min, max) { return 0; };
TileShape.prototype.getRightSolidPixel = function(width, height, min, max) { return width - 1; };
TileShape.prototype.getBottomSolidPixel = function(width, height, min, max) { return height - 1; };

TileShape.uphill = new TileShape();
TileShape.uphill.getTopSolidPixel = function(width, height, min, max) { return Math.floor(height * (width-max-1) / width); };
TileShape.uphill.getLeftSolidPixel = function(width, height, min, max) { return Math.floor(width * (height-max-1) / height); };

TileShape.downhill = new TileShape();
TileShape.downhill.getTopSolidPixel = function(width, height, min, max) { return Math.floor(min * height / width); };
TileShape.downhill.getRightSolidPixel = function(width, height, min, max) { return Math.floor(width - (height - max - 1) * width / height - 1); };

TileShape.upCeiling = new TileShape();
TileShape.upCeiling.getRightSolidPixel = function(width, height, min, max) { return Math.floor(((height - min) * width - 1) / height); };
TileShape.upCeiling.getBottomSolidPixel = function(width, height, min, max) { return Math.floor(((width - min) * height - 1) / width); };

TileShape.downCeiling = new TileShape();
TileShape.downCeiling.getLeftSolidPixel = function(width, height, min, max) { return Math.floor(min * width / height); };
TileShape.downCeiling.getBottomSolidPixel = function(width, height, min, max) { return Math.floor(height - (width - max - 1) * height / width - 1); };

TileShape.uphillRight = new TileShape();
TileShape.uphillRight.getTopSolidPixel = function(width, height, min, max) { return Math.floor(height * (width - max - 1) / width / 2); };
TileShape.uphillRight.getLeftSolidPixel = function(width, height, min, max) { return Math.floor((max * 2 >= height - 2) ? 0 : width * (height - max * 2 - 2) / height); };

TileShape.uphillLeft = new TileShape();
TileShape.uphillLeft.getTopSolidPixel = function(width, height, min, max) { return Math.floor(height * (width - max - 1) / width / 2 + height / 2); };
TileShape.uphillLeft.getLeftSolidPixel = function(width, height, min, max) { return Math.floor(((max + 1) * 2 <= height)?TileShape.maxValue:width * (height - max - 1) * 2 / height); };
TileShape.uphillLeft.getRightSolidPixel = function(width, height, min, max) { return Math.floor(((max + 1) * 2 <= height)?TileShape.minValue:width - 1); };

TileShape.downhillLeft = new TileShape();
TileShape.downhillLeft.getTopSolidPixel = function(width, height, min, max) { return Math.floor(min * height / width / 2); };
TileShape.downhillLeft.getRightSolidPixel = function(width, height, min, max) { return Math.floor(((max + 1) * 2 > height) ? width - 1 : width * 2 - (height - max - 1) * width * 2 / height - 1); };

TileShape.downhillRight = new TileShape();
TileShape.downhillRight.getTopSolidPixel = function(width, height, min, max) { return Math.floor((height + min * height / width) / 2); };
TileShape.downhillRight.getLeftSolidPixel = function(width, height, min, max) { return Math.floor(((min + 1) * 2 <= height) ? TileShape.maxValue : 0); };
TileShape.downhillRight.getRightSolidPixel = function(width, height, min, max) { return Math.floor(((max + 1) * 2 <= height) ? TileShape.minValue : width - (height - max - 1) * 2 * width / height - 1); };

TileShape.topSolid = new TileShape();
TileShape.topSolid.getLeftSolidPixel = TileShape.empty.getLeftSolidPixel;
TileShape.topSolid.getRightSolidPixel = TileShape.empty.getRightSolidPixel;
TileShape.topSolid.getBottomSolidPixel = TileShape.empty.getBottomSolidPixel;

function TileCategory(tilesetMembership) {
   this.membership = new Object();
   for(var tsIndex = 0; tsIndex < tilesetMembership.length; tsIndex++) {
      var tsMemberLookup = new Array();
      var tsMemberList = tilesetMembership[tsIndex].membership;
      this.membership[tilesetMembership[tsIndex].tileset.name] = tsMemberLookup;
      for(var tileIndex = 0; tileIndex < tsMemberList.length; tileIndex++) {
         if (typeof tsMemberList[tileIndex] == 'number')
            tsMemberLookup[tsMemberList[tileIndex]] = true;
         else
            tsMemberLookup[tsMemberList[tileIndex].tileIndex] = tsMemberList[tileIndex].frames;
      }
   }
}

TileCategory.prototype.isTileMember = function(tileset, tileIndex) {
   var membership = this.membership[tileset.name];
   if (membership == null)
      return false;
   var member = membership[tileIndex];
   if (member == true) return true;
   if (member == null) return false;
   return member.indexOf(tileset.tiles[tileIndex].getCurFrameIndex()) > -1;
};

function Solidity(mapping) {
   this.mapping = mapping;
};

Solidity.prototype.getCurrentTileShape = function(tileset, tileIndex) {
   for(var i = 0; i < this.mapping.length; i++) {
      if (this.mapping[i].tileCategory.isTileMember(tileset, tileIndex))
         return this.mapping[i].tileShape;
   }
   return TileShape.empty;
};

var tileCategories = new Object();
var solidity = new Object();
solidity.getSolidityName = function(solid) {
   for(var key in solidity) {
      if (solidity[key] === solid) return key;
   }
   return null;
}
function initTileCategories() {
   tileCategories.Breakable = new TileCategory([
      {tileset:tilesets.Terrain,membership:[4]}]);
   tileCategories.LeftSlope = new TileCategory([
      {tileset:tilesets.Terrain,membership:[7]}]);
   tileCategories.RightSlope = new TileCategory([
      {tileset:tilesets.Terrain,membership:[6]}]);
   tileCategories.Solid = new TileCategory([
      {tileset:tilesets.Terrain,membership:[2,4,5]}]);
   tileCategories.TopSolid = new TileCategory([
      {tileset:tilesets.Terrain,membership:[1]}]);
   solidity.Standard = new Solidity([
      {tileCategory:tileCategories.Solid, tileShape:TileShape.solid},
      {tileCategory:tileCategories.TopSolid, tileShape:TileShape.topSolid},
      {tileCategory:tileCategories.LeftSlope, tileShape:TileShape.uphill},
      {tileCategory:tileCategories.RightSlope, tileShape:TileShape.downhill}]);
}
// DecodeData1 = Cardinality 1-89
// DecodeData2 = Cardinality 90-7921
var dataDigits = ' 1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^*()_+-=[]{}|:;,./?`~';

function Map(scrollWidth, scrollHeight, scrollMarginLeft, scrollMarginTop, scrollMarginRight, scrollMarginBottom) {
   this.scrollX = 0;
   this.scrollY = 0;
   this.scrollWidth = scrollWidth;
   this.scrollHeight = scrollHeight;
   this.scrollMarginLeft = scrollMarginLeft;
   this.scrollMarginTop = scrollMarginTop;
   this.scrollMarginRight = scrollMarginRight;
   this.scrollMarginBottom = scrollMarginBottom;
   this.layers = {};
}

function getMapName(map) {
   for(var key in maps) {
      if (maps[key] === map)
         return key;
   }
   return null;
}

Map.prototype.scroll = function(x, y) {
   if(x < viewWidth - this.scrollWidth) x = viewWidth - this.scrollWidth;
   if(x > 0) x = 0;
   if(y < viewHeight - this.scrollHeight) y = viewHeight - this.scrollHeight;
   if(y > 0) y = 0;
   this.scrollX = x;
   this.scrollY = y;
   for(var key in this.layers) {
      this.layers[key].currentX = this.layers[key].offsetX + Math.floor(x * this.layers[key].scrollRateX);
      this.layers[key].currentY = this.layers[key].offsetY + Math.floor(y * this.layers[key].scrollRateY);
   }
};

Map.prototype.draw = function(ctx) {
   for(var key in this.layers)
      this.layers[key].draw(ctx);
};

Map.prototype.getState = function() {
   var result = {layers:{},cameFromMapName:this.cameFromMapName,mapFlags:this.mapFlags};
   for(var key in this.layers)
      result.layers[key] = this.layers[key].getState();
   return result;
};

Map.prototype.setState = function(data) {
   for(var key in this.layers)
      this.layers[key].setState(data.layers[key]);
   // These are probably correct, but the C# implementation doesn't do this
   // this.cameFromMapName = data.cameFromMapName;
   // this.mapFlags = data.mapFlags;
};

Map.prototype.executeRules = function() {
   gameViewContext.imageSmoothingEnabled = false;
   for(var key in this.layers)
      this.layers[key].executeRules();
};
function decodeData1(data) {
   var result = new Array();
   for(var i = 0; i < data.length; i++) {
      result[i] = dataDigits.indexOf(data[i]);
   }
   return result;
}

function decodeData2(data) {
   var result = new Array();
   for(var i = 0; i < data.length/2; i++) {
      result[i] = dataDigits.indexOf(data[i*2]) * dataDigits.length + dataDigits.indexOf(data[i*2+1]);
   }
   return result;
}

function MapLayer(map, tileset, columns, rows, virtualColumns, virtualRows, offsetX, offsetY, scrollRateX, scrollRateY, priority, tileData) {
   this.map = map;
   this.tileset = tileset;
   this.columns = columns;
   this.rows = rows;
   this.offsetX = offsetX;
   this.offsetY = offsetY;
   this.currentX = offsetX;
   this.currentY = offsetY;
   this.scrollRateX = scrollRateX;
   this.scrollRateY = scrollRateY;
   this.priority = priority;
   if (tileData != null)
   {
      if(tileData.length < columns * rows * 2)
         this.tiles = decodeData1(tileData);
      else
         this.tiles = decodeData2(tileData);
   } else {
      this.tiles = [];
   }
   this.virtualColumns = virtualColumns ? virtualColumns : columns;
   this.virtualRows = virtualRows ? virtualRows : rows;
   this.sprites = [];
}

MapLayer.prototype.encodeTileData2 = function() {
   var result = '';
   for(var i = 0; i < this.tiles.length; i++) {
      result += dataDigits[Math.floor(this.tiles[i] / dataDigits.length)] + dataDigits[this.tiles[i] % dataDigits.length];
   }
   return result;
};

MapLayer.prototype.getState = function() {
   var result = {currentX:this.currentX,currentY:this.currentY,tiles:this.encodeTileData2()};
   var staticSpriteIndices = [];
   for(var key in this)
   {
      if(this[key] instanceof Sprite)
      {
         result["~1" + key] = this[key].serialize();
         var staticIndex = this.sprites.indexOf(this[key]);
         if (staticIndex >= 0)
            staticSpriteIndices[staticIndex] = true;
      }
   }
   var dynamicSprites = [];
   for(spriteIndex = 0; spriteIndex < this.sprites.length; spriteIndex++)
   {
      if (staticSpriteIndices[spriteIndex] !== true)
      {
         dynamicSprites.push("\"" + this.sprites[spriteIndex].serialize().replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"");
      }
   }
   result.dynamicSprites = "[" + dynamicSprites.join(",") + "]";
   return result;
};

MapLayer.prototype.setState = function(source) {
   this.tiles = decodeData2(source.tiles);
   this.sprites.length = 0;
   for(var key in source) {
      if (key.substr(0,2) == "~1") {
         var s = Sprite.deserialize(this,source[key]);
         this[key.substr(2)] = s;
         this.sprites.push(s);
      }
   }
   if (source["dynamicSprites"] != null) {
      var dynamicSprites = JSON.parse(source["dynamicSprites"]);
      for(s in dynamicSprites) {
         this.sprites.push(Sprite.deserialize(this,dynamicSprites[s]));
      }
   }
   this.spriteCategories = Sprite.categorize(this.sprites);
   this.currentX = source.currentX;
   this.currentY = source.currentY;
};

MapLayer.prototype.getTile = function(x, y) {
   return this.tiles[(y % this.rows) * this.columns + (x % this.columns)];
};

MapLayer.prototype.setTile = function(x, y, value) {
   this.tiles[(y % this.rows) * this.columns + (x % this.columns)] = value;
}

MapLayer.prototype.draw = function(ctx) {
   var tileWidth = this.tileset.tileWidth;
   var tileHeight = this.tileset.tileHeight;
   var lastRow = Math.floor((viewHeight - this.currentY - 1) / tileHeight);
   if (lastRow >= this.virtualRows) lastRow = this.virtualRows - 1;
   var lastCol = Math.floor((viewWidth - this.currentX - 1) / tileWidth);
   if (lastCol >= this.virtualColumns) lastCol = this.virtualColumns - 1;
   for(y = Math.floor(-this.currentY / tileHeight), y = y < 0 ? 0 : y; y <= lastRow; y++) {
      for(x = Math.floor(-this.currentX / tileWidth), x = x < 0 ? 0 : x; x <= lastCol; x++) {
         var tile = this.tileset.tiles[this.getTile(x, y)];
         if (tile == null) continue;
         var drx = x * tileWidth + this.currentX;
         var dry = y * tileHeight + this.currentY;
         if (typeof tile == 'number')
            this.tileset.frameSet.frames[tile % this.tileset.frameSet.frames.length].draw(ctx, drx, dry);
         else {
            var frames;
            if (tile instanceof AnimTile)
               frames = tile.getCurFrames();
            else
               frames = tile;
            if (typeof frames == 'number')
               this.tileset.frameSet.frames[frames % this.tileset.frameSet.frames.length].draw(ctx, drx, dry);
            else
               for(var fi = 0; fi < frames.length; fi++)
                  this.tileset.frameSet.frames[frames[fi] % this.tileset.frameSet.frames.length].draw(ctx, drx, dry);
         }
      }
   }
   for(si = 0; si < this.sprites.length; si++) {
      var curSprite = this.sprites[si];
      if (!curSprite.isActive) continue;
      if (curSprite.hidden == 1) continue;
      var frames = curSprite.getCurFrames();
      if (frames == null) continue;
      var frameSet = frameSets[curSprite.states[curSprite.state].frameSetName];
      if (typeof frames == 'number')
         frameSet.frames[frames % frameSet.frames.length].draw(ctx, curSprite.x + this.currentX, curSprite.y + this.currentY);
      else
         for(var fi = 0; fi < frames.length; fi++)
            frameSet.frames[frames[fi] % frameSet.frames.length].draw(ctx, curSprite.x + this.currentX, curSprite.y + this.currentY);
   }
};

MapLayer.noSolid = -2000000000;

MapLayer.prototype.getTopSolidPixel = function(areaX, areaY, areaWidth, areaHeight, solidity) {
   var topTile = Math.floor(areaY / this.tileset.tileHeight);
   var bottomTile = Math.floor((areaY + areaHeight - 1) / this.tileset.tileHeight);
   var leftTile = Math.floor(areaX / this.tileset.tileWidth);
   var rightTile = Math.floor((areaX + areaWidth - 1) / this.tileset.tileWidth);
   var outOfBounds = false;
   if ((topTile < 0) || (topTile >= this.virtualRows) || (bottomTile < 0) || (bottomTile >= this.virtualRows)
      || (leftTile < 0) || (leftTile >= this.virtualColumns) || (rightTile < 0) || (rightTile >= this.virtualColumns))
      outOfBounds = true;
   var minTileTop = (areaY+this.tileset.tileHeight) % this.tileset.tileHeight;
   var tileLeft = leftTile * this.tileset.tileWidth;
   for (var y = topTile; y <= bottomTile; y++) {
      if (rightTile == leftTile) {
         var topMost;
         if (outOfBounds && ((leftTile < 0) || (leftTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            topMost = 0;
         else
            topMost = solidity.getCurrentTileShape(this.tileset, this.getTile(leftTile,y)).getTopSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, areaX - tileLeft,
               areaX + areaWidth - 1 - tileLeft);
         if ((topMost != TileShape.maxValue) && ((y > topTile) || (topMost >= minTileTop))) {
            var result = topMost + y * this.tileset.tileHeight;
            if (result < areaY + areaHeight)
               return result;
            else
               return MapLayer.noSolid;
         }
      } else {
         var topMost;
         if (outOfBounds && ((leftTile < 0) || (leftTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            topMost = 0;
         else
            topMost = solidity.getCurrentTileShape(this.tileset, this.getTile(leftTile, y)).getTopSolidPixel(
                this.tileset.tileWidth, this.tileset.tileHeight, areaX - tileLeft, this.tileset.tileWidth - 1);
         if ((y == topTile) && (topMost < minTileTop))
            topMost = TileShape.maxValue;
         var top;
         for (var x = leftTile + 1; x < rightTile; x++) {
            if (outOfBounds && ((x < 0) || (x >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
               top = 0;
            else
               top = solidity.getCurrentTileShape(this.tileset, this.getTile(x,y)).getTopSolidPixel(
                  this.tileset.tileWidth, this.tileset.tileHeight, 0, this.tileset.tileWidth - 1);
            if ((top < topMost) && ((y > topTile) || (top >= minTileTop)))
               topMost = top;
         }
         if (outOfBounds && ((rightTile < 0) || (rightTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            top = 0;
         else
            top = solidity.getCurrentTileShape(this.tileset, this.getTile(rightTile,y)).getTopSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, 0, (areaX + areaWidth - 1) % this.tileset.tileWidth);
         if ((top < topMost) && ((y > topTile) || (top >= minTileTop)))
            topMost = top;
         if (topMost != TileShape.maxValue) {
            var result = topMost + y * this.tileset.tileHeight;
            if (result < areaY + areaHeight)
               return result;
            else
               return MapLayer.noSolid;
         }
      }
   }
   return MapLayer.noSolid;
};

MapLayer.prototype.getBottomSolidPixel = function(areaX, areaY, areaWidth, areaHeight, solidity) {
   var topTile = Math.floor(areaY / this.tileset.tileHeight);
   var bottomTile = Math.floor((areaY + areaHeight - 1) / this.tileset.tileHeight);
   var leftTile = Math.floor(areaX / this.tileset.tileWidth);
   var rightTile = Math.floor((areaX + areaWidth - 1) / this.tileset.tileWidth);
   var outOfBounds = false;
   if ((topTile < 0) || (topTile >= this.virtualRows) || (bottomTile < 0) || (bottomTile >= this.virtualRows)
      || (leftTile < 0) || (leftTile >= this.virtualColumns) || (rightTile < 0) || (rightTile >= this.virtualColumns))
      outOfBounds = true;
   var maxTileBottom = (areaY + areaHeight - 1 + this.tileset.tileHeight) % this.tileset.tileHeight;
   var tileLeft = leftTile * this.tileset.tileWidth;
   for (var y = bottomTile; y >= topTile; y--) {
      if (rightTile == leftTile) {
         var bottomMost;
         if (outOfBounds && ((leftTile < 0) || (leftTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            bottomMost = this.tileset.tileHeight - 1;
         else
            bottomMost = solidity.getCurrentTileShape(this.tileset, this.getTile(leftTile,y)).getBottomSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, areaX - tileLeft,
               areaX + areaWidth - 1 - tileLeft);
         if ((bottomMost != TileShape.minValue) && ((y < bottomTile) || (bottomMost <= maxTileBottom))) {
            var result = bottomMost + y * this.tileset.tileHeight;
            if (result >= areaY)
               return result;
            else
               return MapLayer.noSolid;
         }
      } else {
         var bottomMost;
         if (outOfBounds && ((leftTile < 0) || (leftTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            bottomMost = this.tileset.tileHeight - 1;
         else
            bottomMost = solidity.getCurrentTileShape(this.tileset, this.getTile(leftTile, y)).getBottomSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, areaX - tileLeft, this.tileset.tileWidth - 1);
         if ((y == bottomTile) && (bottomMost > maxTileBottom))
            bottomMost = TileShape.minValue;
         var bottom;
         for (var x = leftTile + 1; x < rightTile; x++) {
            if (outOfBounds && ((x < 0) || (x >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
               bottom = this.tileset.tileHeight - 1;
            else
               bottom = solidity.getCurrentTileShape(this.tileset, this.getTile(x,y)).getBottomSolidPixel(
                  this.tileset.tileWidth, this.tileset.tileHeight, 0, this.tileset.tileWidth - 1);
            if ((bottom > bottomMost) && ((y < bottomTile) || (bottom <= maxTileBottom)))
               bottomMost = bottom;
         }
         if (outOfBounds && ((rightTile < 0) || (rightTile >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
            bottom = this.tileset.tileHeight - 1;
         else
            bottom = solidity.getCurrentTileShape(this.tileset, this.getTile(rightTile,y)).getBottomSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, 0, (areaX + areaWidth - 1) % this.tileset.tileWidth);
         if ((bottom > bottomMost) && ((y < bottomTile) || (bottom <= maxTileBottom)))
            bottomMost = bottom;
         if (bottomMost != TileShape.minValue) {
            var result = bottomMost + y * this.tileset.tileHeight;
            if (result >= areaY)
               return result;
            else
               return MapLayer.noSolid;
         }
      }
   }
   return MapLayer.noSolid;
};

MapLayer.prototype.getLeftSolidPixel = function(areaX, areaY, areaWidth, areaHeight, solidity) {
   var topTile = Math.floor(areaY / this.tileset.tileHeight);
   var bottomTile = Math.floor((areaY + areaHeight - 1) / this.tileset.tileHeight);
   var leftTile = Math.floor(areaX / this.tileset.tileWidth);
   var rightTile = Math.floor((areaX + areaWidth - 1) / this.tileset.tileWidth);
   var outOfBounds = false;
   if ((topTile < 0) || (topTile >= this.virtualRows) || (bottomTile < 0) || (bottomTile >= this.virtualRows)
      || (leftTile < 0) || (leftTile >= this.virtualColumns) || (rightTile < 0) || (rightTile >= this.virtualColumns))
      outOfBounds = true;
   var minTileLeft = (areaX + this.tileset.tileWidth) % this.tileset.tileWidth;
   var tileTop = topTile * this.tileset.tileHeight;
   for (var x = leftTile; x <= rightTile; x++) {
      if (bottomTile == topTile){
         var leftMost;
         if (outOfBounds && ((topTile < 0) || (topTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            leftMost = 0;
         else
            leftMost = solidity.getCurrentTileShape(this.tileset, this.getTile(x, topTile)).getLeftSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, areaY - tileTop,
               areaY + areaHeight - 1 - tileTop);
         if ((leftMost != TileShape.maxValue) && ((x > leftTile) || (leftMost >= minTileLeft))) {
            var result = leftMost + x * this.tileset.tileWidth;
            if (result < areaX + areaWidth)
               return result;
            else
               return MapLayer.noSolid;
         }
      } else {
         var leftMost;
         if (outOfBounds && ((topTile < 0) || (topTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            leftMost = 0;
         else
            leftMost = solidity.getCurrentTileShape(this.tileset, this.getTile(x, topTile)).getLeftSolidPixel(
                this.tileset.tileWidth, this.tileset.tileHeight, areaY - tileTop, this.tileset.tileHeight - 1);
         if ((x == leftTile) && (leftMost < minTileLeft))
            leftMost = TileShape.maxValue;
         var left;
         for (var y = topTile + 1; y < bottomTile; y++) {
            if (outOfBounds && ((x < 0) || (x >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
               left = 0;
            else
               left = solidity.getCurrentTileShape(this.tileset, this.getTile(x,y)).getLeftSolidPixel(
                  this.tileset.tileWidth, this.tileset.tileHeight, 0, this.tileset.tileHeight - 1);
            if ((left < leftMost) && ((x > leftTile) || (left >= minTileLeft)))
               leftMost = left;
         }
         if (outOfBounds && ((bottomTile < 0) || (bottomTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            left = 0;
         else
            left = solidity.getCurrentTileShape(this.tileset, this.getTile(x, bottomTile)).getLeftSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, 0, (areaY + areaHeight - 1) % this.tileset.tileHeight);
         if ((left < leftMost) && ((x > leftTile) || (left >= minTileLeft)))
            leftMost = left;
         if (leftMost != TileShape.maxValue) {
            var result = leftMost + x * this.tileset.tileWidth;
            if (result < areaX + areaWidth)
               return result;
            else
               return MapLayer.noSolid;
         }
      }
   }
   return MapLayer.noSolid;
};

MapLayer.prototype.getRightSolidPixel = function(areaX, areaY, areaWidth, areaHeight, solidity) {
   var topTile = Math.floor(areaY / this.tileset.tileHeight);
   var bottomTile = Math.floor((areaY + areaHeight - 1) / this.tileset.tileHeight);
   var leftTile = Math.floor(areaX / this.tileset.tileWidth);
   var rightTile = Math.floor((areaX + areaWidth - 1) / this.tileset.tileWidth);
   var outOfBounds = false;
   if ((topTile < 0) || (topTile >= this.virtualRows) || (bottomTile < 0) || (bottomTile >= this.virtualRows)
      || (leftTile < 0) || (leftTile >= this.virtualColumns) || (rightTile < 0) || (rightTile >= this.virtualColumns))
      outOfBounds = true;
   var maxTileRight = (areaX + areaWidth - 1 + this.tileset.tileWidth) % this.tileset.tileWidth;
   var tileTop = topTile * this.tileset.tileHeight;
   for (var x = rightTile; x >= leftTile; x--) {
      if (bottomTile == topTile){
         var rightMost;
         if (outOfBounds && ((topTile < 0) || (topTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            rightMost = this.tileset.tileWidth - 1;
         else
            rightMost = solidity.getCurrentTileShape(this.tileset, this.getTile(x, topTile)).getRightSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, areaY - tileTop,
               areaY + areaHeight - 1 - tileTop);
         if ((rightMost != TileShape.minValue) && ((x < rightTile) || (rightMost <= maxTileRight))) {
            var result = rightMost + x * this.tileset.tileWidth;
            if (result >= areaX)
               return result;
            else
               return MapLayer.noSolid;
         }
      } else {
         var rightMost;
         if (outOfBounds && ((topTile < 0) || (topTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            rightMost = this.tileset.tileWidth - 1;
         else
            rightMost = solidity.getCurrentTileShape(this.tileset, this.getTile(x, topTile)).getRightSolidPixel(
                this.tileset.tileWidth, this.tileset.tileHeight, areaY - tileTop, this.tileset.tileHeight - 1);
         if ((x == rightTile) && (rightMost > maxTileRight))
            rightMost = TileShape.minValue;
         var right;
         for (var y = topTile + 1; y < bottomTile; y++) {
            if (outOfBounds && ((x < 0) || (x >= this.virtualColumns) || (y < 0) || (y >= this.virtualRows)))
               right = this.tileset.tileWidth - 1;
            else
               right = solidity.getCurrentTileShape(this.tileset, this.getTile(x,y)).getRightSolidPixel(
                  this.tileset.tileWidth, this.tileset.tileHeight, 0, this.tileset.tileHeight - 1);
            if ((right > rightMost) && ((x < rightTile) || (right <= maxTileRight)))
               rightMost = right;
         }
         if (outOfBounds && ((bottomTile < 0) || (bottomTile >= this.virtualRows) || (x < 0) || (x >= this.virtualColumns)))
            right = this.tileset.tileWidth - 1;
         else
            right = solidity.getCurrentTileShape(this.tileset, this.getTile(x, bottomTile)).getRightSolidPixel(
               this.tileset.tileWidth, this.tileset.tileHeight, 0, (areaY + areaHeight - 1) % this.tileset.tileHeight);
         if ((right > rightMost) && ((x < rightTile) || (right <= maxTileRight)))
            rightMost = right;
         if (rightMost != TileShape.minValue) {
            var result = rightMost + x * this.tileset.tileWidth;
            if (result >= areaX)
               return result;
            else
               return MapLayer.noSolid;
         }
      }
   }
   return MapLayer.noSolid;
};

MapLayer.prototype.scrollSpriteIntoView = function(sprite, useScrollMargins)
{
   var newX = null;
   var newY = null;
   var marginLeft;
   var marginTop;
   var marginRight;
   var marginBottom;
   if (useScrollMargins)
   {
      marginLeft = this.map.scrollMarginLeft;
      marginTop = this.map.scrollMarginTop;
      marginRight = this.map.scrollMarginRight;
      marginBottom = this.map.scrollMarginBottom;
   }
   else
   {
      marginLeft = 0;
      marginTop = 0;
      marginRight = 0;
      marginBottom = 0;
   }
   if (sprite.x + this.currentX < marginLeft)
   {
      if (this.scrollRateX > 0)
         newX = Math.floor((-sprite.x + marginLeft - this.offsetX) / this.scrollRateX);
      else
         this.currentX = -sprite.x + marginLeft;
   }
   else if (sprite.x + sprite.getSolidWidth() - 1 + this.currentX > viewWidth - marginRight)
   {
      if (this.scrollRateX > 0)
         newX = Math.floor((-sprite.x - sprite.getSolidWidth() + 1 + viewWidth - marginRight - this.offsetX) / this.scrollRateX);
      else
         this.currentX = -sprite.x - sprite.getSolidWidth() + 1 + viewWidth - marginRight;
   }

   if (sprite.y + this.currentY < marginTop)
   {
      if (this.scrollRateY > 0)
         newY = Math.floor((-sprite.y + marginTop - this.offsetY) / this.scrollRateY);
      else
         this.currentY = -sprite.y + marginTop;
   }
   else if (sprite.y + sprite.getSolidHeight() - 1 + this.currentY > viewHeight - marginBottom)
   {
      if (this.scrollRateY > 0)
         newY = Math.floor((-sprite.y - sprite.getSolidHeight() + 1 + viewHeight - marginBottom - this.offsetY) / this.scrollRateY);
      else
         this.currentY = -sprite.Y - sprite.getSolidHeight() + 1 + viewHeight - marginBottom;
   }
   if ((newX != null) || (newY != null))
   {
      if (newX == null) newX = this.currentX;
      if (newY == null) newY = this.currentY;
      this.map.scroll(newX, newY);
   }
}

MapLayer.prototype.processSprites = function() {
   for(var si = 0; si < this.sprites.length; si++)
      this.sprites[si].processed = false;
   for(var si = 0; si < this.sprites.length; si++)
      if (this.sprites[si].isActive)
         this.sprites[si].processRules();
   for(var si = 0; si < this.sprites.length; si++) {
      var sprite = this.sprites[si];
      if (sprite.isDynamic && !sprite.isActive) {
         for(var categoryKey in sprite.categories) {
            for(var spriteKey in this.spriteCategories[categoryKey]) {
               if (this.spriteCategories[categoryKey][spriteKey] === sprite)
                  this.spriteCategories[categoryKey].splice(spriteKey, 1);
            }
         }
         this.sprites.splice(si, 1);
      }
   }   
}

function PlanBase() {
   this.targetDistance = 5;
}

PlanBase.prototype = new GeneralRules();
PlanBase.prototype.constructor = PlanBase;

PlanBase.prototype.isSpriteActive = function(sprite) {
   return sprite.isActive;
};

PlanBase.prototype.mapPlayerToInputs = function(playerNumber, target)
{
   target.mapPlayerToInputs(playerNumber);
};

PlanBase.prototype.followPath = function(sprite, coordinateIndexMember, waitCounterMember) {
   if (sprite.isActive) {
      if (sprite[waitCounterMember] == 0)
         this.pushSpriteTowardCoordinate(sprite, sprite[coordinateIndexMember], 10);
      else
         this.stopSprite(sprite);
      sprite[coordinateIndexMember] = this.checkNextCoordinate(sprite, sprite[coordinateIndexMember], waitCounterMember);
   }
};

PlanBase.prototype.pushSpriteTowardCoordinate = function(sprite, coordinateIndex, force) {
   this.pushSpriteTowardPoint(sprite, this[coordinateIndex], force);
};

PlanBase.prototype.pushSpriteTowardPoint = function(sprite, target, force) {
   var dx = target.x - sprite.x;
   var dy = target.y - sprite.y;

   // Normalize target vector to magnitude of Force parameter
   var dist = Math.sqrt(dx * dx + dy * dy);
   if (dist > 0) {
      dx = dx * force / dist / 10;
      dy = dy * force / dist / 10;

      // Push sprite
      sprite.dx += dx;
      sprite.dy += dy;
   }
};

PlanBase.prototype.checkNextCoordinate = function(sprite, coordinateIndex, waitCounterMember) {
   if (sprite[waitCounterMember] > 0)
   {
      if (++sprite[waitCounterMember] > this[coordinateIndex].weight)
      {
         sprite[waitCounterMember] = 0;
         return (coordinateIndex + 1) % this.m_Coords.length;
      }
      else
         return coordinateIndex;
   }
   var dx = this[coordinateIndex].x - sprite.x;
   var dy = this[coordinateIndex].y - sprite.y;
   if (Math.sqrt(dx * dx + dy * dy) <= this.targetDistance)
   {
      if (this[coordinateIndex].weight > 0)
         sprite[waitCounterMember]++;
      else
         return (coordinateIndex + 1) % this.m_Coords.length;
   }
   return coordinateIndex;
};

PlanBase.prototype.isSpriteTouching = function(sprite) {
   if (!sprite.isActive)
      return false;

   if ((Math.floor(sprite.x) <= this.left + this.width) && (Math.floor(sprite.x) + sprite.getSolidWidth() >= this.left) &&
      (Math.floor(sprite.y) < this.top + this.height) && (Math.floor(sprite.y) + sprite.getSolidHeight() > this.top))
      return true;
   if ((Math.floor(sprite.x) < this.left + this.width) && (Math.floor(sprite.x) + sprite.getSolidWidth() > this.left) &&
      (Math.floor(sprite.y) <= this.top + this.height) && (Math.floor(sprite.y) + sprite.getSolidHeight() >= this.top))
      return true;
   return false;
};

PlanBase.prototype.wasSpriteTouching = function(sprite) {
   if ((Math.floor(sprite.oldX) <= this.left + this.width) && (Math.floor(sprite.oldX) + sprite.getSolidWidth() >= this.left) &&
      (Math.floor(sprite.oldY) < this.top + this.height) && (Math.floor(sprite.oldY) + sprite.getSolidHeight() > this.top))
      return true;
   if ((Math.floor(sprite.oldX) < this.left + this.width) && (Math.floor(sprite.oldX) + sprite.getSolidWidth() > this.left) &&
      (Math.floor(sprite.oldY) <= this.top + this.height) && (Math.floor(sprite.oldY) + sprite.getSolidHeight() >= this.top))
      return true;
   return false;
};

PlanBase.prototype.stopSprite = function(sprite) {
   sprite.dx = sprite.dy = 0;
};

PlanBase.prototype.isInputPressed = function(sprite, input, initialOnly)
{
   return sprite.isInputPressed(input, initialOnly);
};

PlanBase.prototype.drawCounterAsTile = function(tileIndex, counter, style) {
   if (this.left == null)
      return;
   if (counter.currentValue == 0)
      return;
   var map = this.layer.map;
   ts = this.layer.tileset;
   fr = ts.frameSet;
   var disp = gameViewContext;

   var frames = ts.tiles[tileIndex];
   if (typeof frames == "number") {
      frames = [frames];
   } else {
      if (frames instanceof AnimTile)
         frames = frames.getCurFrames();
      if (typeof frames == "number") {
         frames = [frames];
      }
   }

   switch(style)
   {
      case "ClipRightToCounter":
         disp.save();
         disp.beginPath();
         disp.rect(this.left + this.layer.currentX,
            this.top + this.layer.currentY,
            this.width * counter.value / counter.max,
            this.height);
         disp.clip();
         for(var frameIndex in frames)
            fr.frames[frameIndex % fr.frames.length].draw(disp, this.left, this.top);
         disp.restore();
         break;
      case "StretchRightToCounter":
         throw "Not Implemented";
         break;
      case "RepeatRightToCounter":
         for(var i in frames) {
            var frameIndex = frames[i];
            var fillWidth = this.width * counter.value / counter.max;
            for (var repeat = 0; repeat < Math.ceil(fillWidth / ts.tileWidth); repeat++)
               fr.frames[frameIndex % fr.frames.length].draw(disp, this.left + repeat * ts.tileWidth, this.top);
         }
         break;
      case "ClipTopToCounter":
         throw "Not Implemented";
         break;
      case "StretchTopToCounter":
         throw "Not Implemented";
         break;
      case "RepeatUpToCounter":
         for(var i in frames) {
            var frameIndex = frames[i];
            var fillHeight = this.height * counter.value / counter.max;
            for (var repeat = 0; repeat < Math.ceil(fillHeight / ts.tileHeight); repeat++)
               fr.frames[frameIndex % fr.frames.length].draw(disp, this.left + repeat * ts.tileWidth, this.top - repeat * ts.tileHeight - ts.tileHeight);
         }
         break;
   }
};

function drawText(text, x, y) {
   var charWidth = 13;
   var charHeight = 18;
   var font = graphicSheets.CoolFont;
   if (font == null)
      throw "In order to use DrawText, the project must have a Graphic Sheet named \"CoolFont\"";
   var origX = x;
   for (var charIdx = 0; charIdx < text.length; charIdx++) {
      var curChar = text.charCodeAt(charIdx);
      if (curChar > 32) {
         var col = (curChar - 33) % 24;
         var row = Math.floor((curChar - 33) / 24);
         gameViewContext.drawImage(font.image, col * font.cellWidth, row * font.cellHeight,
            font.cellWidth, font.cellHeight, x, y, font.cellWidth, font.cellHeight);
         x += charWidth;
      }
      else if (curChar == 10)
      {
         x = origX;
         y += charHeight;
      }
   }
}

PlanBase.prototype.drawCounterWithLabel = function(label, counter) {
   if (this.left == null)
      return;   
   drawText(label.toString() + counter.value.toString(), this.left, this.top);
};

PlanBase.prototype.isSpriteWithin = function(sprite, relativePosition) {
   var rp = sprite.getRelativePosition(relativePosition);
   return ((rp.x >= this.left) && (rp.y >= this.top) && (rp.x < this.left + this.width) && (rp.y < this.top + this.height));
};

PlanBase.prototype.copyInputsToOld = function(sprite) {
   sprite.oldInputs = sprite.inputs;
};

PlanBase.prototype.transportToPlan = function(sprite, plan, alignment) {
   if (plan.left == null)
      return;

   switch(alignment) {
      case "TopLeft":
      case "TopCenter":
      case "TopRight":
         sprite.y = plan.top;
         break;
      case "LeftMiddle":
      case "CenterMiddle":
      case "RightMiddle":
         sprite.y = plan.top + Math.floor((plan.height - sprite.getSolidHeight())/2);
         break;
      default:
         sprite.y = plan.top + plan.height - sprite.getSolidHeight();
         break;
   }
   switch(alignment)
   {
      case "TopLeft":
      case "LeftMiddle":
      case "BottomLeft":
         sprite.x = plan.left;
         break;
      case "TopCenter":
      case "CenterMiddle":
      case "BottomCenter":
         sprite.x = plan.left + Math.floor((plan.width - sprite.getSolidWidth())/2);
         break;
      default:
         sprite.x = plan.left + plan.width - sprite.getSolidWidth();
         break;
   }
};

PlanBase.prototype.door = function(target, sprites, trigger) {
   var result = -1;
   for (var i=0; i<sprites.length; i++) {
      if (sprites[i].isActive) {
         var outDoor;
         if (this.isSpriteWithin(sprites[i], "CenterMiddle"))
            outDoor = target;
         else if (target.isSpriteWithin(sprites[i], "CenterMiddle"))
            outDoor = this;
         else
            continue;
         if (((trigger & sprites[i].inputs) == trigger) &&
            ((sprites[i].inputs & trigger) != (sprites[i].oldInputs & trigger)))
         {
            result = i;
            this.transportToPlan(sprites[i], outDoor, "BottomCenter");
         }
      }
   }
   return result;
};

PlanBase.prototype.activateSprite = function(target) {
   target.isActive = true;
};


PlanBase.prototype.copyTiles = function(source, target, relativePosition) {
   var src_left = Math.floor(source.left / source.layer.tileset.tileWidth);
   var src_top = Math.floor(source.top / source.layer.tileset.tileHeight);
   var src_right = Math.floor((source.left + source.width - 1) / source.layer.tileset.tileWidth);
   var src_bottom = Math.floor((source.top + source.height - 1) / source.layer.tileset.tileHeight);

   var dst_left = Math.floor(target.left / target.layer.tileset.tileWidth);
   var dst_top = Math.floor(target.top / target.layer.tileset.tileHeight);
   var dst_right = Math.floor((target.left + target.width - 1) / target.layer.tileset.tileWidth);
   var dst_bottom = Math.floor((target.top + target.height - 1) / target.layer.tileset.tileHeight);

   for (var y = src_top; y <= src_bottom; y++) {
      var targety;
      switch(relativePosition) {
         case "TopLeft":
         case "TopCenter":
         case "TopRight":
            targety = dst_top + y - src_top;
            break;
         case "LeftMiddle":
         case "CenterMiddle":
         case "RightMiddle":
            targety = y + Math.floor((dst_top + dst_bottom - src_top - src_bottom) / 2);
            break;
         default:
            targety = dst_bottom + y - src_bottom;
            break;
      }
      if (targety < 0)
         continue;
      if (targety >= target.layer.virtualRows)
         break;
      for (var x = src_left; x <= src_right; x++) {
         var targetx;
         switch(relativePosition) {
            case "TopLeft":
            case "LeftMiddle":
            case "BottomLeft":
               targetx = dst_left + x - src_left;
               break;
            case "TopCenter":
            case "CenterMiddle":
            case "BottomCenter":
               targetx = x + Math.floor((dst_left + dst_right - src_left - src_right) / 2);
               break;
            default:
               targetx = dst_right + x - src_right;
               break;
         }
         if (targetx < 0)
            continue;
         if (targetx >= target.layer.virtualColumns)
            break;
            
         target.layer.setTile(targetx,targety,source.layer.getTile(x,y));
      }
   }
};

PlanBase.prototype.copyTo = function(target, relativePosition) {
   this.copyTiles(this, target, relativePosition);
};

PlanBase.prototype.copyFrom = function(source, relativePosition) {
   this.copyTiles(source, this, relativePosition);
};

PlanBase.prototype.deactivateSprite = function(target) {
   target.isActive = false;
};

PlanBase.prototype.matchSpritePosition = function(target, source) {
   target.oldX = target.x;
   target.oldY = target.y;
   target.x = source.x;
   target.y = source.y;
};

PlanBase.prototype.isSpriteWithin = function(sprite, relativePosition) {
   var rp = sprite.getRelativePosition(relativePosition);
   if ((rp.x >= this.left) && (rp.y >= this.top) && (rp.x < this.left + this.width) && (rp.y < this.top + this.height)) {
      return true;
   }
   return false;
};

PlanBase.prototype.scrollSpriteIntoView = function(sprite, useScrollMargins) {
   this.layer.scrollSpriteIntoView(sprite, useScrollMargins);
};

PlanBase.prototype.testCollisionRect = function(sourceSprite, targets) {
   sourceSprite.testCollisionRect(targets);
};

PlanBase.prototype.addSpriteAtPlan = function(spriteDefinition, relativePosition) {
   var spriteParams = "{\"~1\":\"" + spriteDefinition + "\", \"x\":0,\"y\":0" +
   ",\"dx\":0,\"dy\":0,\"state\":0,\"frame\":0,\"active\":true,\"priority\":0,\"solidityName\":\"\"}";
   
   GeneralRules.lastCreatedSprite = Sprite.deserialize(this.layer, spriteParams);

   if ((this.m_Coords != null) && (this.m_Coords.length > 0))
   {
      offset = lastCreatedSprite.getRelativePosition(relativePosition);
      GeneralRules.lastCreatedSprite.x = this[0].x - offset.x;
      GeneralRules.lastCreatedSprite.y = this[0].y - offset.y ;
   }

   this.layer.sprites.push(GeneralRules.lastCreatedSprite);
   for(var categoryKey in spriteDefinitions[spriteDefinition].prototype.categories) {
      var category = spriteDefinitions[spriteDefinition].prototype.categories[categoryKey];
      if (this.layer.spriteCategories[category] == null)
         this.layer.spriteCategories[category] = [];
      this.layer.spriteCategories[category].push(GeneralRules.lastCreatedSprite);
   }
}

PlanBase.prototype.mapMouseToSprite = function(target, instantMove, hotSpot) {
   target.mapMouseToSprite(instantMove, hotSpot);
}
var maps = {};
var mapInitializers = {};
mapInitializers.Level1 = function() {
   maps.Level1 = new Map(3888, 512, 64,200,400,200);
   maps.Level1.layers.Main = new MapLayer(
      maps.Level1, tilesets.Terrain,122,16,122,16,0,0,1,1,0,
      '                                                                                                                          ' + 
      '                                                                                                                          ' + 
      '  11111                                                                                                                   ' + 
      '  33333                                                                                                                   ' + 
      '  33333                                                                 1111111111                                        ' + 
      '  33333                                                                 3333333333           1111111111111                ' + 
      '  31111111                                                              3333333333           3333333333333                ' + 
      '  33333333                  11111111                                  755555333333       11111113333333333                ' + 
      '555555555555556             33355533                          75555555522225555553       333333333333333555555555555555555' + 
      '222222222222225555555555555555522233                       75552222222222222222223       333311111133333222222222222222222' + 
      '222222222222222222222222222222222233      75556         75552222222222222233222223 75556 333333333333333222222222222222222' + 
      '22222222222222222222222222222222225555555552225555555555522222222222222222333332255522255555555555555333222222222222222222' + 
      '22222222222222222222222222222222222222222222222233222222222222222222222222333332222222222332222222222333222222222222222222' + 
      '22222222222222222222222222222222222222222222222233222222222222222222222222333332222222222332222222222333222222222222222222' + 
      '22222222222222222222222222222222222222222222222233222222222222222222222222222222222222222332222222222333222222222222222222' + 
      '22222222222222222222222222222222222222222222222233222222222222222222222222222222222222222332222222222333222222222222222222');
   maps.Level1.layers.Main.executeRules = function() {
      this.Level1_Plan_1.executeRules();
      this.processSprites();
   };
   maps.Level1.layers.Main.Level1_Plan_1 = new PlanBase();
   maps.Level1.layers.Main.Level1_Plan_1.layer = maps.Level1.layers.Main;
   maps.Level1.layers.Main.Level1_Plan_1.executeRules = function() {
      // genMap
      this.genMap();
      
   };
   maps.Level1.layers.Main.initSprites = function() {
      this.m_Cursor_1 = new spriteDefinitions.Cursor(this,128,114,0,0,spriteDefinitions.Cursor.statesEnum.Cursor,0,true,1,null);
      this.m_Tank_2 = new spriteDefinitions.Tank(this,160,160,0,0,spriteDefinitions.Tank.statesEnum.Right,0,true,1,solidity.Standard,0);
      this.sprites = [this.m_Cursor_1,this.m_Tank_2];
      this.spriteCategories = Sprite.categorize(this.sprites);
   };
   maps.Level1.layers.Main.initSprites();
};
window.onresize = resizeView;
window.onload = startGame;
// Begin  MapGen.js


var tileType = {
   empty: 0,
   top: 1,
   solidWall: 2,
   backWall: 3,
   block: 4,
   grass: 5
}

var offsets = [
         [3, 0],
         [-1, -2],
         [0, 3],
         [-2, -2],
         [1, 1],
         [1, -1],
         [0, 1]
      ];

var isMapGenned = false;
PlanBase.prototype.genMap = function() {
   var layer = this.layer;
   var layerWidth = layer.columns;
   var layerHeight = layer.rows;
   var tileWidth = layer.tileset.tileWidth;
   var tileHeight = layer.tileset.tileHeight;

   var tank = currentMap.layers.Main.spriteCategories.Tank[0];
   if (tank) {
      if (tank.x > layerWidth * tileWidth - 100 || tank.y == 480) {
         isMapGenned = false;
         tank.x = 100;
         var explodables = currentMap.layers.Main.spriteCategories.Explodable;
         for (var i=explodables.length -1; i >= 0; i--) {
            explodables[i].deactivate();
         }
      }
   }

   if (isMapGenned) return;
   isMapGenned = true;

   tank.y = 200;

   var setTile = function(x, y, tile) {
      layer.tiles[x + y*layerWidth] = tile;
   }
   var getTile = function(x, y) {
      return layer.tiles[x + y*layerWidth];
   }

   for (var x = 0; x < layerWidth; x++) {
      for (var y = 0; y < layerHeight; y++) {
         setTile(x, y, 0);
      }
   }

   var iterX = 11;
   var iterY = parseInt(layerHeight/2);

   for (var i=0; i<12; i++) setTile(i, iterY, tileType.top);
   while (iterX < layerWidth - 12) {
      var offset = offsets.rand();
      iterX += offset[0];
      iterY += offset[1];
      if (iterY < 4) iterY += 2;
      if (iterY > layerHeight - 4) iterY -= 2;
      var platformWidth = parseInt(Math.random() * 8 + 2);
      for (var ww = 0; ww < platformWidth; ww++) {
         setTile(iterX, iterY, tileType.top);
         iterX++;
      }
      if (Math.random() < 0.15) {
         this.addSprite("ZombieSpawner", (iterX - platformWidth / 2) * tileWidth, (iterY - 2) * tileHeight);
      }
   }

   iterX = layerWidth - 11;
   iterY = parseInt(layerHeight/2);

   for (var i=0; i<12; i++) setTile(layerWidth - i, iterY, tileType.top);
   while (iterX > 12) {
      var offset = offsets.rand();
      iterX -= offset[0];
      iterY += offset[1];
      if (iterY < 4) iterY += 2;
      if (iterY > layerHeight - 4) iterY -= 2;
      var platformWidth = parseInt(Math.random() * 8 + 2);
      for (var ww = 0; ww < platformWidth; ww++) {
         setTile(iterX, iterY, tileType.top);
         iterX--;
      }
      if (Math.random() < 0.15) {
         this.addSprite("ZombieSpawner", (iterX - platformWidth / 2) * tileWidth, (iterY - 2) * tileHeight);
      }
   }

   
   // Clean-up
   for (var x = 0; x < layerWidth; x++) {
      var foundTop = false;
      for (var y = 0; y < layerHeight; y++) {
         var t = getTile(x, y);
         if (t != tileType.empty) foundTop = true;
         if (t == tileType.empty && foundTop) setTile(x, y, tileType.backWall);
      }      
      for (var y = layerHeight-1; y >= 0; y--) {
         var t = getTile(x, y);
         if (t == tileType.empty) break;
         if (t == tileType.backWall) setTile(x, y, tileType.solidWall);
         if (t == tileType.top) {
            setTile(x, y, tileType.grass);
            break;
         }
      }
   }
   /*for (var x = 1; x < layerWidth-1; x++) {
      for (var y = 0; y < layerHeight; y++) {
         var t = getTile(x, y);
         var tL = getTile(x-1, y);
         var tR = getTile(x+1, y);
         if (t == tileType.grass && (tL == tileType.backWall || tL == tileType.top || tL == tileType.empty)) {
            setTile(x, y, tileType.top);
            for (var yIter = y + 1; yIter < layerHeight; yIter++) {
               setTile(x, yIter, tileType.backWall);
            }
         }
      } 
   }*/
};



PlanBase.prototype.addSprite = function(spriteDefinition, x, y) {
   var spriteParams = "{\"~1\":\"" + spriteDefinition + "\", \"x\":0,\"y\":0" +
   ",\"dx\":0,\"dy\":0,\"state\":0,\"frame\":0,\"active\":true,\"priority\":0,\"solidityName\":\"\"}";
   
   GeneralRules.lastCreatedSprite = Sprite.deserialize(this.layer, spriteParams);

   GeneralRules.lastCreatedSprite.x = x;
   GeneralRules.lastCreatedSprite.y = y ;
   GeneralRules.lastCreatedSprite.solidity = solidity.Standard;

   this.layer.sprites.push(GeneralRules.lastCreatedSprite);
   for(var categoryKey in spriteDefinitions[spriteDefinition].prototype.categories) {
      var category = spriteDefinitions[spriteDefinition].prototype.categories[categoryKey];
      if (this.layer.spriteCategories[category] == null)
         this.layer.spriteCategories[category] = [];
      this.layer.spriteCategories[category].push(GeneralRules.lastCreatedSprite);
   }
}




Array.prototype.rand = function () {
    if (this.length == 1) return this[0];
    if (this.length) {
        var index = parseInt(this.length * Math.random());
        return this[index];
    }
}
// Begin  DrawMeter.js

function DrawMeter(ctx, x, y, width, height, value, max, cellCount) {
   var border = 3;

   ctx.beginPath();
   ctx.rect(x, y, width, height);
   ctx.fillStyle = "black";
   ctx.fill();

   var innerHeight = (height - border * 2);
   ctx.beginPath();
   ctx.rect(x + border, y + border, width - (border * 2), innerHeight);
   ctx.fillStyle = "#005400";
   ctx.fill();

   var offset = innerHeight - innerHeight * (value / max);
   var innerHeight = (height - border * 2);
   ctx.beginPath();
   ctx.rect(x + border, y + border + offset , width - (border * 2), innerHeight - offset );
   ctx.fillStyle = "green";
   ctx.fill();

   for (var yOff = y + border + innerHeight / cellCount; yOff < y + innerHeight; yOff += innerHeight / cellCount) {
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(x,yOff);
      ctx.lineTo(x + width,yOff);
      ctx.stroke();      
   }
}
// Begin  InitOverride.js
startGame = function() {
   initGraphicSheets();
   initFramesets();
   initTilesets();
   initTileCategories();
   firstMap();
   var gameView = document.getElementById('gameView');

   gameView.onmousedown = function(e) {
      e = e || window.event;
      mouseInfo.x = e.pageX - this.offsetLeft;
      mouseInfo.y = e.pageY - this.offsetTop;
      mouseInfo.pressed = true;
      mouseInfo.clicked = true;
   };

   gameView.onmousemove = function(e) {
      e = e || window.event;
      mouseInfo.x = e.pageX - this.offsetLeft;
      mouseInfo.y = e.pageY - this.offsetTop;
   };

   gameView.onmouseup = function(e) {
      mouseInfo.pressed = false;
   };

   gameView.onmouseout = function(e) {
      mouseInfo.pressed = false;
   };

   gameView.ontouchstart = function(e) {
      e = e || window.event;
      e.preventDefault();
      var touch = e.touches.item(0);
      mouseInfo.x = e.pageX - touch.clientX;
      mouseInfo.y = e.pageY - touch.clientY;
      mouseInfo.pressed = true;
      mouseInfo.clicked = true;
   };

   gameView.ontouchmove = function(e) {
      e = e || window.event;
      e.preventDefault();
      var touch = e.touches.item(0);
      mouseInfo.x = e.pageX - touch.clientX;
      mouseInfo.y = e.pageY - touch.clientY;
      mouseInfo.pressed = true;
   };
   
   gameView.ontouchend = function(e) {
      e = e || window.event;
      e.preventDefault();
      mouseInfo.pressed = false;
   }

   gameViewContext = gameView.getContext('2d');
   mainLoop.interval = setInterval("pulse()", mainLoop.milliseconds);
}

window.onload = startGame;
