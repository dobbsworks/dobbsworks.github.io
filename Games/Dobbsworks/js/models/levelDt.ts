class LevelDT
{
    constructor(
    public code: string,
    public userId: number,
    public timestamp: number,
    public name: string,
    public description: string,
    public levelData: string,
    public thumbnail: string,
    public recordFrames: number,
    public recordUserId: number,
    public firstClearUserId: number,

    public numberOfClears: number,
    public numberOfAttempts: number,
    public numberOfUniquePlayers: number,
    public numberOfLikes: number,
    public numberOfDislikes: number,

    public levelState: number,

    public username: string,

    public isGlitch: boolean
    ){}
}