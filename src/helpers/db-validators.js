import { Role, User } from "../models/index.js";

export const isRoleValid = async (role = '') => {
    const existRole = await Role.findOne({ role });
    if (!existRole) {
        throw new Error(`El rol ${role} no está registrado en la BD`);
    }
};


export const isEmailValid = async (email = '') => {
    const existEmail = await User.findOne({ email });
    if (existEmail) {
        throw new Error(`El email ${email} ya está registrado en la BD`);
    }
};