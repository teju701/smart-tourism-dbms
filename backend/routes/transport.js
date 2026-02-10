import express from 'express';
import { getTransportByCity,getCheapestTransportByCity } from '../controllers/transportController.js';

const router = express.Router();

router.get('/:city_id',getTransportByCity);
router.get('/cheap/:city_id',getCheapestTransportByCity);

export default router;