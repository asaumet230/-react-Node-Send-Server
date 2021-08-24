const { response } = require('express');
const  { nanoid }  =  require ( 'nanoid' );
const multer = require('multer');
const fs = require('fs'); // file system

const Enlaces = require('../models/Enlaces');



// middleware propios:

const subirArchivo = async (req, res = response, next) => {

    console.log(req.usuario);
    // Objeto de configuración de multer:
        const configuracionMulter = {

            limits: { fileSize: req.usuario? 1024 * 1024 *10 : 1024 * 1024 }, // Esto es 1Mb
            storage: fileStorage = multer.diskStorage({

                destination:( req, file, callback) => {

                    callback(null, __dirname+'/../uploads');

                },
                filename: (req, file, callback) => {

                    const extension = file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length);
                    callback(null, `${nanoid()}${extension}`);
                }
            })
        }
    

    // Creas la función upload:
    const upload = multer(configuracionMulter).single('archivo');

    upload( req, res, async(error) => {
        console.log(req.file);
        if(!error) {
            return res.status(200).json({ 
                archivo: req.file.filename
            });
        } else {
            console.log(error);
            return res.status(400).json({
                msg: 'Usuario no autorizado para esta operacion, debe autenticarse'
            })
        }
    });

}


const eliminarArchivo = async (req, res = response) => {

    console.log(req.archivo);
    console.log('desde eliminar archivo');

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        console.log('Archivo eliminado');       
    } catch (error) {
        console.log(error);
    }

}

const descargarArchivo = async (req, res= response, next) => {

    const { archivo } = req.params;

    const archivoDescarga = __dirname + '/../uploads/' + archivo;

    res.download(archivoDescarga);

     const enlace =  await Enlaces.findOne({ nombre: archivo });

     // Validamos la cantidad de descargas:
    const { descargas, nombre, _id } = enlace;

    if(descargas === 1) {

        // Eliminamos el archivo del storage o del file system:
        req.archivo = nombre; // Asi pasamos esta variable hacia el controlador de eliminarArchivo


        // Elminamos la entrada de la base de datos:
        await Enlaces.findOneAndDelete({_id});

        // con next pasamos al controlador de eliminar archivo y no se llama en la ruta de archivos
        next();

    } else {

        // Si las descargas son > 1:
        enlace.descargas --;
        await enlace.save();

    }


}


module.exports = {
    subirArchivo,
    eliminarArchivo,
    descargarArchivo
} 