import {Request, Response} from "express";
import log4js from 'log4js';
import httpStatus from 'http-status';
import {
    countReviewsByGameId,
    createReview as createReviewApi,
    getReviewsByGameId,
} from "src/services/review/reviewService";
import {ReviewCreateDto} from "src/dto/reviews/reviewCreateDto";
import {ReviewFindDto} from "src/dto/reviews/reviewFindDto";
import {InternalError} from "src/system/internalError";

export const createReview = async (req: Request, res: Response) => {
    try {
        const reviewDto = new ReviewCreateDto(req.body);
        const review = await createReviewApi({
            ...reviewDto,
        });
        res.status(httpStatus.CREATED).send({
            review,
        });
    } catch (err) {
        const { message, status } = new InternalError(err);
        log4js.getLogger().error('Error in creating review.', err);
        res.status(status).send({message});
    }
};

export const getReviewsByGame = async (req: Request, res: Response) => {
    try {
        const query = new ReviewFindDto(req.body);
        const reviews = await getReviewsByGameId(query);
        res.send({
            reviews,
        });
    } catch (err) {
        const { message, status } = new InternalError(err);
        log4js.getLogger().error(`Error in searching students.`, err);
        res.status(status).send({ message });
    }
};

export const countReviews = async (req: Request, res: Response) => {
    try {
        const {gameIds} = req.body;
        const result = await countReviewsByGameId(gameIds);
        res.send(result);
    } catch (err) {
        const { message, status } = new InternalError(err);
        log4js.getLogger().error(`Error in searching students.`, err);
        res.status(status).send({ message });
    }
};

