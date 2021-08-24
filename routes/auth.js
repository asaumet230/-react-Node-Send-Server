const { Router } = require('express');
const { check } = require('express-validator');
const authJWT  = require('../middleware/authJWT');
const { autenticarUsuario, usuarioAutenticado } = require('../controllers/authController');


const router = Router();

router.post('/', [

    check('email', 'El email no es valido').isEmail(),
    check('password', 'El password con formato incorrecto').isLength({ min: 6 }).not().isEmpty()

], autenticarUsuario );

router.get('/', authJWT, usuarioAutenticado);


module.exports = router;