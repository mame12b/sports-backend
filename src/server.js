import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';




console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Connect to the database
connectDB();

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});