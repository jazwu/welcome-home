import express from 'express';
import { getOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.get('/:id', getOrder);

export default router;