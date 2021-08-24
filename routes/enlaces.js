const { Router } = require('express');
const { check } = require('express-validator');

const authJWT = require('../middleware/authJWT');
const { nuevoEnlace, tienePassword, obtenerEnlace, todosEnlaces, verificarPassword } = require('../controllers/enlacesController');


const router = Router();

router.post('/', [
    check('nombre', 'sube un archivo').not().isEmpty(),
    check('nombre_original', 'sube un archivo').not().isEmpty()
], authJWT, nuevoEnlace);

router.get('/', todosEnlaces)

router.get('/:url', tienePassword, obtenerEnlace);

router.post('/:url', verificarPassword, obtenerEnlace );


module.exports = router;