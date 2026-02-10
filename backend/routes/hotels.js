import express from 'express'
import {getHotelsByCity,addHotel,getTopHotelsByCity} from '../controllers/hotelsController.js'

const router = express.Router();

// ✅ Always place specific routes before general dynamic routes
router.get('/top/:city_id', getTopHotelsByCity);
router.get('/:city_id', getHotelsByCity);
router.post('/', addHotel);

export default router;

