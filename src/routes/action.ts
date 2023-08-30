import { logger } from '@services/logger';
import { doAction } from '@services/opencps';
import express from 'express';
import { AuthenticatedRequest } from 'middleware/auth';
import multer from 'multer';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req, file, cb) {
      if (file.fieldname === "file") {
        cb(null, './uploads/xlsx/')
      }
      else if (file.fieldname === "tepdinhkem") {
        cb(null, './uploads/tepdinhkem/');
      }
    },
    filename: function (_req, file, cb) {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8'
    )
    cb(null, true)
  },
});

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