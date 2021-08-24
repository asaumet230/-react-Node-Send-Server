const jwt = require('jsonwebtoken');

const authJWT = (req, res, next) => {

    // Esta es otra forma de leer el token y no enviaro por (req.header(x-auth-token)):
    const authHeader = req.get('Authorization');

    try {

        if(authHeader) {

            // Extraes el token del header:
            const token = authHeader.split(' ')[1];

            // Verificas el token:
            const usuario = jwt.verify(token, process.env.SECRET_JWT_SEED);
            
            // Agregas el usuario al request:
            req.usuario = usuario;
        }

         

    } catch (error) {
        
        // Respuesta no valida de token no valido:
        console.log(error);
        return res.status(401).json({
            msg: 'Token no valido o no existe'
        });
    }

     next(); // Para que pase al siguiente middleware
    
}


module.exports = authJWT;