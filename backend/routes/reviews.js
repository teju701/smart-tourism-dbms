import express from 'express';
import {addReviewsBatch, getUserReviews,updateReview,deleteReview,getReviewsByEntity} from '../controllers/reviewsController.js';

const router = express.Router();

router.post('/batch',addReviewsBatch);
router.get('/user/:user_id', getUserReviews);
router.get('/:entity_type/:entity_id', getReviewsByEntity);
router.put('/:review_id', updateReview);
router.delete('/:review_id', deleteReview);


export default router;