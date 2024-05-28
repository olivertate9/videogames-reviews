import mongoose, {Document, Schema} from 'mongoose';

export interface IReview extends Document {
    gameId: number;
    quote?: string;
    rating: number;
    publishedAt: Date;
}

const reviewSchema = new Schema({
    gameId: {
        type: Number,
        required: [true, 'Game ID is required'],
    },

    quote: {
        type: String,
        required: false,
        maxlength: [500, 'Quote must be less than 500 characters'],
    },

    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [0, 'Rating must be between 0 and 10'],
        max: [10, 'Rating must be between 0 and 10'],
    },

    publishedAt: {
        type: Date,
        required: [true, 'Published date is required'],
    },
});

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;