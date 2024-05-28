import chai from 'chai';
import sinon from 'sinon';
import {ObjectId} from 'mongodb';
import mongoSetup from '../mongoSetup';
import Review from 'src/model/review';
import {ReviewCreateDto} from 'src/dto/reviews/reviewCreateDto';
import {ReviewFindDto} from 'src/dto/reviews/reviewFindDto';
import * as reviewService from 'src/services/review/reviewService';
import axios from 'axios';

const {expect} = chai;
const sandbox = sinon.createSandbox();

const gameId1 = 12345;
const gameId2 = 67890;
const nonExistentGameId = 99999;

const review1 = new Review({
    _id: new ObjectId(),
    quote: "Great game!",
    rating: 9,
    gameId: gameId1,
    publishedAt: new Date('2023-12-25')
});

const review2 = new Review({
    _id: new ObjectId(),
    quote: "Not my favorite.",
    rating: 6,
    gameId: gameId1,
    publishedAt: new Date('2024-01-10')
});

const review3 = new Review({
    _id: new ObjectId(),
    quote: "Amazing experience!",
    rating: 10,
    gameId: gameId2,
    publishedAt: new Date('2024-02-05')
});

describe('Review Service', () => {
    before(async () => {
        await mongoSetup;
        await review1.save();
        await review2.save();
        await review3.save();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('createReview should create a new review and return it', (done) => {
        const reviewDto: ReviewCreateDto = {
            quote: "Fun but buggy.",
            rating: 7,
            gameId: 1,
            publishedAt: new Date('2024-01-07')
        };
        sandbox.stub(axios, 'get').resolves({data: {}});

        reviewService.createReview(reviewDto)
            .then(async (createdReview) => {
                expect(createdReview).to.exist;
                expect(createdReview.quote).to.equal(reviewDto.quote);
                expect(createdReview.rating).to.equal(reviewDto.rating);
                expect(createdReview.gameId).to.equal(reviewDto.gameId);

                done();
            })
            .catch((error: Error) => done(error));
    });

    it('createReview should throw an error if game does not exist', (done) => {
        const reviewDto: ReviewCreateDto = {
            quote: "Doesn't matter.",
            rating: 5,
            gameId: nonExistentGameId,
        };
        sandbox.stub(axios, 'get').resolves({data: null});

        reviewService.createReview(reviewDto)
            .catch((error: Error) => {
                expect(error.message).to.equal('Game not found');
                done();
            });
    });

    it('getReviewsByGameId should return a list of reviews for a given game', (done) => {
        const findDto: ReviewFindDto = {gameId: gameId1, size: 10, from: 0};
        reviewService.getReviewsByGameId(findDto)
            .then(async (reviews) => {
                expect(reviews).to.exist;
                expect(reviews.length).to.equal(2);
                expect(reviews[0]._id).to.eql(review2._id);
                expect(reviews[1]._id).to.eql(review1._id);

                done();
            })
            .catch((error: Error) => done(error));
    });

    it('countReviewsByGameId should return correct review counts', (done) => {
        reviewService.countReviewsByGameId([gameId1, gameId2])
            .then((counts) => {
                expect(counts).to.eql({ [gameId1]: 2, [gameId2]: 1 });
                done();
            })
            .catch(done);
    });
});