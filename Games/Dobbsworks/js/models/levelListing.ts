class LevelListing
{
    constructor(
    public level: LevelDT,
    public author: UserDT,
    public wrHolder: UserDT,
    public isStarted: boolean,
    public isCleared: boolean,
    public isLiked: boolean,
    public isDisliked: boolean,
    public personalBestFrames: number,
    public contestVote: number,
    public contestRank: number
    ){}
}