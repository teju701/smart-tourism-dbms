import express from 'express'
import {getAttractionsByCity, getTopAttractionsByCity} from '../controllers/attractionsController.js'

const router = express.Router();

router.get('/:city_id',getAttractionsByCity);

router.get('/top/:city_id',getTopAttractionsByCity);

export default router;

