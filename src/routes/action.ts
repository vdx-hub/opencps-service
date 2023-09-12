import { logger } from '@services/logger';
import { doAction } from '@services/opencps';
import express from 'express';
import { AuthenticatedRequest } from 'middleware/auth';

const router = express.Router();

router.post('/:actionCode/doAction', async function (req: AuthenticatedRequest, res) {
  const token = req.token
  logger('DossierAction').info(`dossierId: ${req.body.dossierId}, actionCode: ${req.params.actionCode}`)
  let resOpencpsAction = await doAction({
    actionCode: req.params.actionCode,
    dossierId: req.body.dossierId,
    actionNote: req.body.actionNote || '',
    assignUsers: req.body.assignUsers || '',
    payment: req.body.payment || '',
    token
  })
  res.status(200).send(resOpencpsAction)
})
export default router