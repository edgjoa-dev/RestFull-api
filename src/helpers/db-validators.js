import { Role, User } from "../models/index.js";

//Validación Role
export const isRoleValid = async (role = '') => {
    const existRole = await Role.findOne({ role });
    if (!existRole) {
        throw new Error(`El rol ${role} no está registrado en la BD`);
    }
};

//Validación de email
export const isEmailValid = async (email = '') => {
    const existEmail = await User.findOne({ email });
    if (existEmail) {
        throw new Error(`El email ${email} ya está registrado en la BD`);
    }
};

//Validación por ID
export const isIdValid = async (id = '') => {
    const existID = await User.findById(id);
    if (!existID) {
        throw new Error(`ID: ${id}, no es un id válido en la base de datos`);
    }
};