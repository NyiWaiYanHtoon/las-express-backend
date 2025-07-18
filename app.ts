import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

//routes
import videoRoutes from './routes/video.js';
import userRoutes from './routes/user.js';
import categoryRoutes from './routes/category.js'
import authRoutes from './routes/auth.js'
import kafkaRoutes from './routes/kafka.js'
import likeRoutes from './routes/like.js'
import dislikeRoutes from './routes/dislike.js'
import statsRoutes from './routes/stats.js'

import { connectProducer } from "./kafka/kafka-producer.js";

await connectProducer();
dotenv.config();

const app = express();
const port = 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)
app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    },
  })
)
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Learning Analytics System Backend is running! 🚀');
});

app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/kafka', kafkaRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/dislike', dislikeRoutes);
app.use('/api/stats', statsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
