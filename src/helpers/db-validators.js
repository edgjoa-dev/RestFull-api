import { Role } from "../models/index.js";

 export const isRoleValid =  async(role='')=>{
        const existRole = await Role.findOne({role});
        if(!existRole){
            throw new Error(`El rol ${role} no está registrado en la BD`);
        }
    }