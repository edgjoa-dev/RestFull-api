import { Router } from 'express';
import { usersGet, userGet, createUser, updateUser, deleteUser } from '../controllers/users.controller.js';
import { check, body } from 'express-validator';
import { fieldValidator } from '../middleware/index.js';
import { isEmailValid, isIdValid, isRoleValid } from '../helpers/db-validators.js';

const router = Router();

router.get('/', usersGet);

router.get('/:id', [
    check('id','No es in ID válido').isMongoId(),
    check('id').custom(isIdValid),
    fieldValidator
],userGet);

router.post('/', [
    check('name', 'El nombre de usuario es obligatorio').notEmpty(),
    body('password', 'El password es obligatorio y de 9 caracteres minimo').isLength({ min: 9 }).notEmpty(),
    check('email', 'El email es obligatorio').isEmail().notEmpty(),
    check('email').custom(isEmailValid),
    // check('role', 'El rol no es válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isRoleValid),
    fieldValidator
], createUser);

router.put('/:id', [
    check('id','No es in ID válido').isMongoId(),
    check('id').custom(isIdValid),
    check('role').custom(isRoleValid),
    fieldValidator
], updateUser);

router.delete('/:id', [
    check('id','No es in ID válido').isMongoId(),
    check('id').custom(isIdValid),
    fieldValidator
],deleteUser);

export default router;