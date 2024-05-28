import express from 'express';
import {
    countReviews,
    createReview,
    getReviewsByGame,
} from 'src/controllers/review';

const router = express.Router();

router.post('', createReview);
router.get('', getReviewsByGame);
router.post('/_counts', countReviews);

export default router;