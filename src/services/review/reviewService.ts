import axios from 'axios';
import Review, {IReview} from 'src/model/review';
import {ReviewCreateDto} from "src/dto/reviews/reviewCreateDto";
import {ReviewFindDto} from "src/dto/reviews/reviewFindDto";
import {ReviewInfoDto} from "../../dto/reviews/reviewInfoDto";
import config from "src/config";

const GAME_API_URL = config.games_api.url;

export const createReview = async (reviewDto: ReviewCreateDto): Promise<IReview> => {
    await validateReview(reviewDto);
    const review = new Review(reviewDto);
    return review.save();
};

export const getReviewsByGameId = async (reviewDto: ReviewFindDto): Promise<ReviewInfoDto[]> => {
    const {
        gameId,
        size,
        from,
    } = reviewDto;

    if (typeof size === 'undefined' || typeof from === 'undefined') {
        throw new Error('from and size should be number and required');
    }

    const reviews = await Review
        .find({gameId: gameId})
        .sort({publishedAt: 'desc'})
        .skip(from)
        .limit(size);

    return reviews.map(review => toInfoDto(review));
};

export const countReviewsByGameId = async (
    gameIds: number[]
): Promise<Record<number, number>> => {

    const counts = await Review.aggregate([
        {$match: {gameId: {$in: gameIds}}},
        {$group: {_id: "$gameId", count: {$sum: 1}}},
    ]);

    const countMap: Record<number, number> = {};
    gameIds.forEach(id => countMap[id] = 0);

    counts.forEach(countObj => {
        countMap[countObj._id] = countObj.count;
    });

    return countMap;
};

const toInfoDto = (review: IReview): ReviewInfoDto => {
    return <ReviewInfoDto>({
        _id: review._id,
        quote: review.quote,
        rating: review.rating,
    });
};

export const validateReview = async (reviewDto: ReviewCreateDto) => {
    const gameId = reviewDto.gameId;

    if (typeof gameId !== 'number') {
        throw new Error('Game ID should be a number');
    }

    if (!gameId) {
        throw new Error('Game ID is required');
    }

    const response = await axios.get(`${GAME_API_URL}/${gameId}`);
    if (!response.data) {
        throw new Error('Game not found');
    }

    if (reviewDto.publishedAt
        && reviewDto.publishedAt.getTime() > new Date().getTime()) {
        throw new Error('publishedAt should be before the current date and time');
    }

    if (reviewDto.rating === undefined || reviewDto.rating === null) {
        throw new Error('Rating is required');
    }
    if (reviewDto.rating < 1 || reviewDto.rating > 10) {
        throw new Error('rating should be from 1 to 10');
    }
};
