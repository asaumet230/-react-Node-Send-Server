const {Schema, model} = require('mongoose');

const EnlacesSchema = Schema({

    url: {
        type: String,
        require: true
    },
    nombre: {
        type: String,
        require: true
    },
    nombre_original : {
        type: String,
        require: true
    },
    descargas : {
        type: Number,
        default: 1
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    },
    password: {
        type: String,
        default: null
    },
    creado : {
        type: Date,
        default: Date.now()
    }

})


module.exports = model('Enlaces', EnlacesSchema);