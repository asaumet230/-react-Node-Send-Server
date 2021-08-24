const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')


exports.nuevoUsuario = async (req, res) => {

    const errores = validationResult(req);

    if(!errores.isEmpty()) {
       return res.status(400).json({
            errores: errores.array()
        })
    }

    const{ email, password } = req.body;

    try {
        
        // Validacion existencia de usuario:
        let usuario = await Usuario.findOne({email});
        
        if(usuario) {

            // Respuesta si ya existe:
            res.status(409).json({
                msg:'El usuario ya existe'
            });
        }
        
        // Creacion del usuario:
        usuario = new Usuario( req.body );

        // Hashear usuario:
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        // Guardas el usuario:
        await usuario.save();

        // Respuesta de la creación de usuario:
        return res.status(200).json({
            ok: true,
            msg:'Usuario registrado exitosamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error comuniquese con el administrador'
        })
    }   
};


