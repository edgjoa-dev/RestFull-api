import { request, response } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../models/index.js";


export const validateJWT = async( req = request, res = response, next )=> {

    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWTSECRETKEY);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            });
        }

        
        if (!user.status) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB status false'
            });
        }

        req.user = user;
        req.uid = uid;
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
    
    next();
}


