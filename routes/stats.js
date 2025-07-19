import express from 'express';
import { getOverallStats } from '../utils/get-overall-stats';
const router = express.Router();
router.post('/overall', async (req, res) => {
    //getting the timeframe from request body
    const { timeframe } = req.body;
    if (!['today', 'week', 'all'].includes(timeframe)) {
        return res.status(400).json({ error: 'Invalid timeframe' });
    }
    //calling util function to get stats 
    const stats = await getOverallStats(timeframe);
    // if null, it is error
    if (!stats)
        return res.status(500).send("Something wnent wrong!");
    //ok
    res.status(200).json(stats);
});
export default router;
