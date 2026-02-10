import express from 'express'
import {getfoodplacesByCity,addFoodPlace,getAvgFoodCostPerCity} from '../controllers/foodController.js'

const router = express.Router();

router.get('/:city_id',getfoodplacesByCity);
router.post('/',addFoodPlace);
router.get('/avgcost/:city_id',getAvgFoodCostPerCity);

export default router;

