import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import bodyParser from 'body-parser';
import routers from 'src/routers/reviews';
import express from 'express';
import * as reviewService from 'src/services/review/reviewService';
import { IReview } from "../../model/review";

const { expect } = chai;
chai.use(chaiHttp);
const app = express();
app.use(bodyParser.json({ limit: '1mb' }));
app.use('/', routers);
const sandbox = sinon.createSandbox();

describe('Review Controller Integration Test', () => {

    afterEach(() => {
        sandbox.restore();
    });

    it('should create a review successfully', (done) => {
        const mockReview = {
            gameId: 123,
            quote: 'Great game!',
            rating: 5,
            publishedAt: new Date('2024-05-22T14:30:00.000Z')
        };

        const createReviewStub = sandbox.stub(reviewService, 'createReview');
        createReviewStub.resolves(mockReview as IReview);

        chai.request(app)
            .post('')
            .send({ mockReview })
            .end((_, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should handle errors when creating a review', (done) => {
        const mockReview = {
            gameId: 123,
            quote: 'Great game!',
            rating: 5,
            publishedAt: new Date('2024-05-22T14:30:00.000Z')
        };
        const mockError = new Error('Database error');
        const createReviewStub = sandbox.stub(reviewService, 'createReview');
        createReviewStub.rejects(mockError);

        chai.request(app)
            .post('')
            .send({ mockReview })
            .end((_, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', mockError.message);
                done();
            });
    });

    it('should get reviews by game successfully', (done) => {
        const mockReviews = [
            {
                _id: '665097f8b0dc7a303c7ab9a6',
                quote: 'Great game!',
                rating: 5
            }
        ];

        const getReviewsByGameIdStub = sandbox.stub(reviewService, 'getReviewsByGameId');
        getReviewsByGameIdStub.resolves(mockReviews);

        chai.request(app)
            .get('')
            .send({ gameId: 123 })
            .end((_, res) => {
                expect(res).to.have.status(200);
                expect(res.body.reviews).to.deep.equal(mockReviews);
                done();
            });
    });

    it('should handle errors when getting reviews by game', (done) => {
        const mockError = new Error('Database error');
        const getReviewsByGameIdStub = sandbox.stub(reviewService, 'getReviewsByGameId');
        getReviewsByGameIdStub.rejects(mockError);

        chai.request(app)
            .get('')
            .send({ gameId: 123 })
            .end((_, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', mockError.message);
                done();
            });
    });

    it('should count reviews successfully', (done) => {
        const mockResult = {
            gameId: 123,
            count: 5
        };

        const countReviewsByGameIdStub = sandbox.stub(reviewService, 'countReviewsByGameId');
        countReviewsByGameIdStub.resolves(mockResult);

        chai.request(app)
            .post('/_counts')
            .send({ gameIds: [123] })
            .end((_, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equal(mockResult);
                done();
            });
    });

    it('should handle errors when counting reviews', (done) => {
        const mockError = new Error('Database error');
        const countReviewsByGameIdStub = sandbox.stub(reviewService, 'countReviewsByGameId');
        countReviewsByGameIdStub.rejects(mockError);

        chai.request(app)
            .post('/_counts')
            .send({ gameIds: [123] })
            .end((_, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', mockError.message);
                done();
            });
    });
});
