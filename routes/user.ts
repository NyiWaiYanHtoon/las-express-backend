import express from 'express';
const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  res.send('List of users (dummy)');
});

export default router;
