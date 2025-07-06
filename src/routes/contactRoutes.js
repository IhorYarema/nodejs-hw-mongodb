import express from 'express';
import {
  getContactsController,
  getContactByIdController,
} from '../controllers/contactController.js';

const router = express.Router();

router.get('/contacts', getContactsController);

router.get('/contacts/:contactId', getContactByIdController);

export default router;
