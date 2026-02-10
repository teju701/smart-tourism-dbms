import express from 'express';
import { createBooking, getLastBookingForUser,getBookingsForUser,cancelBooking} from '../controllers/bookingsController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/last/:user_id', getLastBookingForUser);
router.get('/user/:user_id', getBookingsForUser);
router.delete('/:booking_id', cancelBooking);

export default router;