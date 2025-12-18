import { request, response, Router } from "express";
import { login } from "../controllers/index.js";
import { check } from "express-validator";
import { fieldValidator } from "../middleware/field-validator.js";


const router = Router();

router.post('/login', [
    check('email', 'El correo no es válido, intente nuevamente').isEmail(),
    check('password', 'El password no es válido, intente nuevamente').not().isEmpty(),
    fieldValidator
],login);

router.post('/register', (req=request, res=response) => {
    res.json({ msg: 'Registro exitoso' });
});



export default router;