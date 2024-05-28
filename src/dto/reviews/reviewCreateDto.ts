export class ReviewCreateDto {
    gameId?: number;
    quote?: string;
    rating?: number;
    publishedAt?: Date;

    constructor(data: Partial<ReviewCreateDto>) {
        this.gameId = data.gameId;
        this.quote = data.quote;
        this.rating = data.rating;
        this.publishedAt = data.publishedAt;
    }
}