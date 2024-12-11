import express from 'express';
import { getPieces } from '../controllers/item.controller.js';

const router = express.Router();

router.get('/:id', getPieces);

export default router;