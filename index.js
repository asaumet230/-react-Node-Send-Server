const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { conexionDB } = require('./config/db');

const app = express();

conexionDB();

// Habilitar Cors:

/* Esta es la forma de restringir el acceso a la API */
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(opcionesCors));

// Lectura del body:
app.use( express.json());

// Habilitar carpeta publica:
app.use( express.static('uploads'));

//Rutas:
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

app.listen(process.env.PORT, ()=> {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
})