const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        
        await mongoose.connect(process.env.BD_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('DB conectada');

    } catch (error) {
        console.log(error);
        process.exit(1);   
    }
}

module.exports = {
   conexionDB: dbConnection
};