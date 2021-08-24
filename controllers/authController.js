const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/Usuario');


exports.autenticarUsuario = async ( req, res ) => {


    // Verificar si hay errores:
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    }

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({email});

        if(!usuario) {
            return res.status(401).json({
                msg:'El usuario no existe'
            })
        }

        // Validación de password:
        const validacionPassword = await bcrypt.compareSync(password, usuario.password)

        if(!validacionPassword){
            return res.status(401).json({
                msg: 'email o password incorrectos'
            });
        }
        
        // Si el password es correcto:

        // Payload o lo que se guarda en el JWT:
        const payload = {
            id: usuario._id,
            nombre: usuario.nombre
        }

        // Generamos el token:
        const token = await jwt.sign( payload, process.env.SECRET_JWT_SEED, { expiresIn: '3h'});
        
        // Enviamos la respuesta con el token:
        res.status(200).json({
            token
        });
    
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error comuniquese con el administrador'
        });
    }
};


exports.usuarioAutenticado = async (req, res) => {
        
        const _id = req.usuario.id;
     
    try {

        const usuarioDB = await Usuario.findById({ _id }, 'nombre email _id');

        return res.status(200).json({
            usuario: usuarioDB,
            msg: 'Usuario autenticado exitosamente'
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error comuniquese con el administrador'
        });
    }
};