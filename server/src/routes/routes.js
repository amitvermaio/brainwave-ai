import { Router } from "express";
import authRoutes from './auth.route.js';
import documentRoutes from './document.route.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);

export default router;