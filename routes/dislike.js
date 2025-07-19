import express from 'express';
import { insertDislike } from '../utils/insert-dislike';
const router = express.Router();
router.post('/', async (req, res) => {
    const { videoId, userId } = req.body;
    if (!videoId || !userId) {
        return res.status(400).send("Something went wrong!");
    }
    try {
        const result = await insertDislike(videoId, userId);
        if (!result)
            return res.status(500).send("Something went wrong!");
        return res.status(200).json({ message: 'Dislike recorded', data: result });
    }
    catch (error) {
        console.log('Error in dislike route:', error);
        return res.status(500).send("Something went wrong!");
    }
});
export default router;
