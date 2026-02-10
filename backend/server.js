import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();

import citiesRoutes from './routes/cities.js';
import hotelsRoutes from './routes/hotels.js';
import foodRoutes from './routes/foodplaces.js';
import attractionsRoutes from './routes/attractions.js';
import transportRoutes from './routes/transport.js';
import bookingsRoutes from './routes/bookings.js';
import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/reviews.js';
import usersRoutes from './routes/users.js';
import imageRoutes from './routes/images.js';
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(cors());
app.use(express.json());

// ORDER MATTERS — AUTH FIRST
app.use('/api/auth', authRoutes);

// OTHER ROUTES
app.use('/api/cities',citiesRoutes);
app.use('/api/hotels',hotelsRoutes);
app.use('/api/foodplaces',foodRoutes);
app.use('/api/attractions',attractionsRoutes);
app.use('/api/transport',transportRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/images', imageRoutes);


app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})
