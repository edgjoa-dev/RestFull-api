import { Router } from 'express';
import { usersGet, userGet, createUser, updateUser, deleteUser } from '../controllers/users.controller.js';
import { check } from 'express-validator';
import { fieldValidator } from '../middleware/index.js';

const router = Router();

router.get('/', usersGet);

router.get('/:id', userGet);

router.post('/',[
    check('name', 'El nombre de usuario es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').isEmail().notEmpty(),
    check('password', 'El password es obligatorio y de 9 caracteres minimo').isLength({ min: 9 }).notEmpty(),
    check('role', 'El rol no es válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    fieldValidator
],createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;