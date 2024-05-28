export class ReviewFindDto {
    gameId?: number;
    size?: number;
    from?: number;

    constructor(query: Partial<ReviewFindDto>) {
        this.gameId = query.gameId;
        this.size = query.size;
        this.from = query.from;
    }
}
