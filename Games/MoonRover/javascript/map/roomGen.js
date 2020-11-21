class RoomGenerator {
    CreateCorridor(width, height) {
        let borders = [];
        let sprites = [];
        
        borders.push(new LeftWall(0));
        borders.push(new RightWall(width));
        borders.push(new Floor(height));
        borders.push(new Ceiling(0));

        let lowestPlatformY = height - 150;
        let highestPlatformY = 300;
        let minSpacePerPlatform = 225;
        let totalVerticalSpace = lowestPlatformY - highestPlatformY;
        let numberOfLines = 1 + Math.floor(totalVerticalSpace / minSpacePerPlatform);
        let spacePerLine = totalVerticalSpace / (numberOfLines - 1); 

        for (let lineNum = 0; lineNum < numberOfLines; lineNum++) {
            let y = highestPlatformY + lineNum * spacePerLine;
            let platformLine = this.CreatePlatformLine(width, 0, y)
            borders.push(...(platformLine.borders));
            sprites.push(...(platformLine.sprites));
        }

        // Exit door? bottom right

        return {borders: borders, sprites: sprites};
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

            let platformHitsWall = platform.x2 > width;

            if (!platformHitsWall && Math.random() < platformProbability) {
                borders.push(platform);
                if (Math.random() < enemyProbability) {
                    let platformCenterX = (platform.x1 + platform.x2) / 2;
                    let enemy = new EnemyGoombud(platformCenterX, platform.y - 30);
                    sprites.push(enemy);
                }
            }
            x += Math.random() * gapRange + minGap;
        }

        return {borders: borders, sprites: sprites};
    }
}