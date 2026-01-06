import { request, response } from "express";
import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import { generateJWT } from "../helpers/generateJWT.js";




export const login = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {
        //-Verificar si email existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            });
        }

        //-Si el usuario está activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'Usuario no existe, verifica tu email - state false'
            });
        }

        //-Vericar la contraseña
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Error de contraseña, verifica nuevamente - password'
            });
        }

        //-Generar el JWT
        const token = await generateJWT(user.id);


        res.status(200).json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};



export const register = (req = request, res = response) => {
    res.status(201).json({
        msg: 'Registro exitoso'
    });
};