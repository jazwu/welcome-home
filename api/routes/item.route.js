import express from 'express';
import { getPieces, getItems, createItem } from '../controllers/item.controller.js';

const router = express.Router();

router.get('/:id', getPieces);
router.get('/', getItems);
router.post('/create', createItem);

export default router;