

export const isAdminRole = (req, res, next) => {

    if ( !req.user ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    };

    const { role, name } = req.user;
    if ( role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ name } no es administrador - No puede hacer esto`
        });
    };

    next();
}


