import express from 'express';
import { getPieces, getItems } from '../controllers/item.controller.js';

const router = express.Router();

router.get('/:id', getPieces);
router.get('/', getItems);

export default router;