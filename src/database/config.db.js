import mongoose from 'mongoose';

let connectionPromise = null;

export const dbConnection = async () => {

    if (connectionPromise) return connectionPromise;

    connectionPromise = (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URL);
            console.log('Base de datos online');
        } catch (error) {
            console.log(error);
            throw new Error('Error al iniciar la base de datos');
        }
    })();

    return connectionPromise;

};

// Para fines de testing
export const resetConnectionPromise = () => {
    connectionPromise = null;
};
