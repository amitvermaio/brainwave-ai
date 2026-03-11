import { Router } from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  updateDocument,
} from '../controllers/document.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';
const router = Router();

router.use(authenticate);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);
router.put('/:id', updateDocument);

export default router;