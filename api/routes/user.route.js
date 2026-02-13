import express, { Router } from 'express';
import { test } from '../controllers/user.controller.js';
import { updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utills/verifyUser.js';
import { deleteUser } from '../controllers/user.controller.js';
import { getUserListings, getUser } from '../controllers/user.controller.js';

const router = express.Router();


router.get('/test', test) ;
router.post('/update/:id',verifyToken, updateUser);
router.delete('/update/:id',verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser );
export default router;
