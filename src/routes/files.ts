import { logger } from '@services/logger';
import { removeFileOpencps, uploadToOpencps } from '@services/opencps';
import express from 'express';
import { unlink } from 'fs-extra';
import { AuthenticatedRequest } from 'middleware/auth';
import multer from 'multer';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req, file, cb) {
      cb(null, './uploads/files/')
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

router.post('/dossierFiles/upload', upload.single('file'), async function (req: AuthenticatedRequest, res) {
  if (!req.file) {
    res.status(400).send("Please send a file!")
  }

  logger('DossierUploadFile').info(`dossierId: ${req.body.dossierId}`)
  const token = req.token
  let resOpencpsAction = await uploadToOpencps({
    token,
    dossierId: req.body.dossierId,
    dossierPartNo: req.body.dossierPartNo,
    dossierTemplateNo: req.body.dossierTemplateNo,
    file: req.file,
    fileTemplateNo: req.body.fileTemplateNo,
    referenceUid: req.body.referenceUid
  })
  if (req.file?.path) {
    await unlink(req.file?.path)
  }
  res.status(200).send(resOpencpsAction)
})

router.delete('/dossierFiles/:dossierId/:referenceUid', async function (req: AuthenticatedRequest, res) {
  logger('DossierDeleteFile').info(`dossierId: ${req.params.dossierId}, referenceUid: ${req.params.referenceUid}`)
  const token = req.token
  let resOpencpsAction = await removeFileOpencps({
    token,
    dossierId: req.params.dossierId,
    fileReferenceUid: req.params.referenceUid
  })
  res.status(200).send(resOpencpsAction)
})
export default router