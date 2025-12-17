import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users.js';
import { dbConnection } from './database/config.db.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        
        //Routes
        this.usersPath = '/api/users';

        //DB coection
        this.dbConnection();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
    }

    //Conexión a la base de datos
    async dbConnection() {
        await dbConnection();
    };

    middlewares() {
        // Lectura y parseo de body
        this.app.use(express.json());

        // Configuración de CORS
        this.app.use(cors());

        // Directorio Público
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    routes() {
        this.app.use(this.usersPath, usersRouter);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`);
        });
    }
}

export default Server;