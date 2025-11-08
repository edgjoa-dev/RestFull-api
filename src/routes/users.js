const { Router } = require("express");
const { usersGet, userGet, createUser, updateUser, deleteUser } = require("../controllers/users.controller");


const router = Router();


router.get('/', usersGet)

router.get('/:id', userGet)

router.post('/', createUser)

router.put('/:id', updateUser)

router.delete('/:id', deleteUser)



module.exports = router;