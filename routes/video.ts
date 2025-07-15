import express from 'express';
const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  res.send('List of videos (dummy)');
});

router.post('/', async (req: express.Request, res: express.Response) => {
  const newVideo = req.body;
  res.status(201).send({ message: 'Video created', video: newVideo });
});

export default router;
