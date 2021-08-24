const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

// Controllers Usuario:
const { nuevoUsuario }  = require('../controllers/usuarioController.js');


router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email valido').isEmail(),
    check('password', 'La contraseña debe ser mínimo de 6 caracteres').isLength({ min: 6 })
 ], nuevoUsuario);


module.exports = router;
