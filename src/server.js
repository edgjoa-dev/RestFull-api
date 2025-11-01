require("dotenv").config({ path: "./src/config/.env" });
const express = require('express');
const path = require('path');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
    };

    middlewares() {
        this.app.use(express.static(path.join(__dirname, 'public')));
    };

    routes() {
        this.app.get('/api', (req, res) => { res.send(' Hola Mundo ') });
    };

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto: ${this.port}`);
        });
    };

}

module.exports = Server;