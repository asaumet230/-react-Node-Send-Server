const { Router }= require('express');

const authJWT = require('../middleware/authJWT');
const { subirArchivo, descargarArchivo, eliminarArchivo }= require('../controllers/archivosController');

const router = Router();


router.post('/', authJWT, subirArchivo );

router.get('/:archivo', descargarArchivo, eliminarArchivo)


module.exports = router;