import { Router } from 'express';
import { usersGet, userGet, createUser, updateUser, deleteUser } from '../controllers/users.controller.js';

const router = Router();

router.get('/', usersGet);

router.get('/:id', userGet);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;