import { Router } from 'express';
import {
  getFavorites,
  markFavorite,
  removeFavorite,
  toggleFavorite,
  updateNote,
  getContact,
  getContacts,
  getStats
} from '../controllers/contactController';

const router = Router();

router.get('/favorites', getFavorites);
router.get('/stats', getStats);
router.get('/', getContacts);

router.get('/:id', getContact);
router.post('/:id/favorite', markFavorite);
router.delete('/:id/favorite', removeFavorite);
router.patch('/:id/favorite', toggleFavorite);
router.put('/:id/note', updateNote);

export default router;