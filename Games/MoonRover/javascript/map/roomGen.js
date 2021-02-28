class RoomGenerator {
    CreateCorridor(width, height) {
        let lowestPlatformY = height - 150;
        let highestPlatformY = 300;
        let minSpacePerPlatform = 225;
        let totalVerticalSpace = lowestPlatformY - highestPlatformY;
        let numberOfLines = 1 + Math.floor(totalVerticalSpace / minSpacePerPlatform);
        let spacePerLine = totalVerticalSpace / (numberOfLines - 1); 

        let room = this.CreateBaseRoom(width, height, lowestPlatformY - spacePerLine);
        let bounds = [...room.borders];
        room.borders = [];

        for (let lineNum = 0; lineNum < numberOfLines; lineNum++) {
            let y = highestPlatformY + lineNum * spacePerLine;
            let platformLine = this.CreatePlatformLine(width, 0, y)
            platformLine.borders.forEach(p => {
                if (p.x1 < 0) p.x1 = 0;
                if (p.x2 > width) p.x2 = width;
            })
            room.borders.push(...(platformLine.borders));
            room.sprites.push(...(platformLine.sprites));
        }
        room.borders.push(...(bounds));

        return room;
    }

    CreateArenaRoom(width, height) {
        let room = this.CreateBaseRoom(width, height, false);

        let lowestPlatformY = height - 150;
        let midPlatformY = lowestPlatformY - 225;
        let playerPlatformY = midPlatformY - 200;

        let bottomPlatform = new Platform(width/3, width*2/3, lowestPlatformY);
        let leftPlatform = new Platform(30, width/3, midPlatformY);
        let rightPlatform = new Platform(width*2/3, width - 30, midPlatformY);
        let playerPlatform = new Platform(width/2-120, width/2+120, playerPlatformY);
        
        room.borders = [leftPlatform, rightPlatform, playerPlatform, bottomPlatform, ...room.borders];

        for (let platform of [leftPlatform, rightPlatform, bottomPlatform]) {
            let platformCenterX = (platform.x1 + platform.x2)/2;
            let enemy = new EnemyGoombud(platformCenterX, platform.y - 30);
            room.sprites.push(enemy);
        }

        return room;
    }

    CreateBossRoom(width, height) {
        let room = this.CreateBaseRoom(width, height, false);

        return room;
    }

    CreateBaseRoom(width, height, exitHeight) {
        let borders = [];
        let sprites = [];
        
        borders.push(new LeftWall(0));
        borders.push(new RightWall(width));
        borders.push(new Floor(height));
        borders.push(new Ceiling(0));

        if (exitHeight) {
            let levelExit = new LevelExit(width, exitHeight)
            sprites.push(levelExit);
        }

        return {borders: borders, sprites: sprites, width: width, height: height};
    }
    
    CreatePlatformLine(width, x, y) {
        let borders = [];
        let sprites = [];

        let isMirror = Math.random() > 0.5;

        let minWidth = 200;
        let maxWidth = 1000;
        let widthRange = maxWidth - minWidth;
        let minGap = 200;
        let maxGap = 500;
        let gapRange = maxGap - minGap;

        let platformProbability = 0.90;
        let enemyProbability = 0.40;

        if (Math.random() > 0.5) {
            x += Math.random() * gapRange + minGap;
        }
        while (x < width - maxGap) {
            let platformWidth = Math.random() * widthRange + minWidth;
            let platform = isMirror ?
                new Platform(x, x+platformWidth, y) :
                new Platform(width-(x+platformWidth), width-x, y);
            x += platformWidth;
            platform.x1 -= (platform.x1 % 32);
            platform.x2 -= (platform.x2 % 32);
            platform.y -= platform.y % 32;
            platform.y += Math.floor(Math.random()*4 - 2) * 32;

            if (Math.random() < platformProbability) {
                platform.x2 += 32;
                borders.push(platform);
                if (Math.random() < enemyProbability) {
                    let platformCenterX = (platform.x1 + platform.x2) / 2;
                    let enemy = new EnemyOrbiter(platformCenterX, platform.y - 30);
                    sprites.push(enemy);
                }
            }
            x += Math.random() * gapRange + minGap;
        }

        return {borders: borders, sprites: sprites};
    }
}