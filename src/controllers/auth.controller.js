import { request, response } from "express";



export const login = (req = request, res = response) => {

    res.status(200).json({
        msg: 'Login exitoso'
    });
};



export const register = ( req=request, res=response) => {
    res.status(201).json({
        msg: 'Registro exitoso'
    });
};