import express from 'express';
import { insertLike } from '../utils/insert-like';

const router = express.Router();

router.post('/', async (req, res) => {
  const { videoId, userId } = req.body;

  if (!videoId || !userId) {
    return res.status(400).send("Something went wrong!");
  }
  try {
    const result = await insertLike(videoId, userId);
    if(!result) return res.status(500).send("Something went wrong!");
    return res.status(200).json({ message: 'Like recorded', data: result });
  } catch (error) {
    console.log('Error in like route:', error);
    res.status(500).send("Something went wrong!");
  }
});

export default router;
