import express from 'express';

const router = express.Router();
router.post('/ping', async function (_req, res) {
  res.status(200).send("Service is up and running!")
})
export default router