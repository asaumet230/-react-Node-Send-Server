const  { nanoid }  =  require ( 'nanoid' );
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const Enlaces = require('../models/Enlaces');
const { response } = require('express');

const nuevoEnlace = async (req, res= response) => {

    // Validamos si hay errores en la petición:
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
       return res.status(400).json({
            errores: errores.array()
        });
    }

    // Extraer los valores del body:
    const { nombre_original, nombre } = req.body;

    try {

        // Crear el objeto de enlace:
        const enlace = new Enlaces();
        enlace.url = nanoid();
        enlace.nombre = nombre;
        enlace.nombre_original = nombre_original;        
                
        // Si el usuario esta autenticado:
        const usuario = req.usuario;

        if(usuario) {

            const { descargas, password } = req.body;

            // Asignas el número de descargas:
            if(descargas) {
            
                enlace.descargas = descargas;
            }

            // Asignas el password:
            if(password) {

                const salt = await bcrypt.genSalt(10);
                enlace.password = await bcrypt.hash(password, salt);
            }
            
            // Por último asignamos el autor:
            enlace.autor = usuario.id 
        }

        // Almacenamos el objeto enlace en la DB:
        await enlace.save();

        // Mensaje de respuesta exitosa:

        res.status(200).json({
            url: enlace.url
        })

    } catch (error) {

        console.log(error);
        return res.status(400).json({
            msg: 'Error comuniquese con el administrador'
        });
    }
}

const tienePassword = async (req, res = response, next) => {

    const url = req.params.url;

    try {

        const enlace = await Enlaces.findOne({url});

        if(!enlace) {

            return res.status(404).json({
                 msg: 'Ese enlace no existe'
             });
        }

        if(enlace.password) {

            return res.status(200).json({
                password: true,
                enlace: enlace.url
            });

        }
        
        next();
        
    } catch(error) {
        console.log(error);
    }
}

const verificarPassword = async(req, res= response, next) => {

    const { url } = req.params;
    const { password } = req.body;

    // consultar por el enlace:
    const enlace = await Enlaces.findOne({url});

   if(bcrypt.compareSync(password, enlace.password)){

        next();

   } else {
       return res.status(404).json({
           msg: 'Password incorrecto'
       })
   }

}


const obtenerEnlace = async (req, res = response, next) => {

    const url = req.params.url; 

    // Verificamos si el enlace existe:

    const enlace = await Enlaces.findOne({url});
    // console.log(enlace);

    // Si no existe:

    if(!enlace) {

        return res.status(404).json({
            msg: 'Ese enlace no existe'
        })
    }

    // Si existe enviamos respuesta positiva:
    return res.status(200).json({
        archivo: enlace.nombre,
        password: false
    });
}


const todosEnlaces = async (req, res= response, next) => {

    try {
        
        const enlaces = await Enlaces.find({}, 'url').select('-_id');
        console.log(enlaces);

        return res.status(200).json({
            enlaces
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'Error comuniquese con el administrador'
        });
        
    }
}



module.exports = { 
    nuevoEnlace,
    tienePassword,
    obtenerEnlace,
    todosEnlaces,
    verificarPassword
    
}