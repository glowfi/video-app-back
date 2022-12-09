import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import AuthRoute from './routes/auth.js';
import CommentRoutes from './routes/comments.js';
import UserRoutes from './routes/users.js';
import VideoRoutes from './routes/videos.js';

const app = express();

app.use(
    cors({
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        origin: ['https://video-app-1h47.onrender.com', '*']
    })
);

dotenv.config();
const connect = async () => {
    await mongoose.connect(process.env.MONGO);
};

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', AuthRoute);
app.use('/api/users', UserRoutes);
app.use('/api/videos', VideoRoutes);
app.use('/api/comms', CommentRoutes);

// Error Handling
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Somenthing went Wrong';
    return res.json({
        success: false,
        status,
        message
    });
});

// const filename = url.fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);

// app.use(express.static(path.join(dirname, '/client/build')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(dirname, '/client/build', 'index.html'));
// });

app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
    // Connect to Atlas
    connect()
        .then(() => {
            console.log('Connected to DB!');
        })
        .catch((err) => {
            console.log('Error Occured :', err);
        });
    // Start Express
    console.log('Started Express Server...');
});
