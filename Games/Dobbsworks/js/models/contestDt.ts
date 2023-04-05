class ContestDT
{
    constructor(
    public id: number,
    public title: string,
    public description: string,
    public openEntryTime: Date,
    public votingTime: Date,
    public resultsTime: Date,
    public endTime: Date,    
    public status: number,
    public submittedLevel: string,
    public isHidden: boolean
    ){}
}