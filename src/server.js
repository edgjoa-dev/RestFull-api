require("dotenv").config({ path: "./.env" });
const express = require('express');

const cors = require('cors')
const path = require('path');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Routes
        this.usersPath = '/api/users'

        //Middlewares
        this.middlewares();

        //Routes
        this.routes();
    };

    middlewares() {
        //Lectura y parseo de body
        this.app.use(express.json());

        //Configuración de CORSS
        this.app.use(cors());

        //Directorio Publico
        this.app.use(express.static(path.join(__dirname, 'public')));
    };

    routes() {
        this.app.use(this.usersPath, require('./routes/users'));
    };

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`);
        });
    };

}

module.exports = Server;