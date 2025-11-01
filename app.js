
//dotenv
require('dotenv').config({ path: './src/config/.env' });
const express = require('express');
const app = express();


app.get('/', (req, res) => { res.send(' Hola Mundo ') });

app.listen( process.env.PORT , () => {
    console.log(`Servidor corrinedo en puerto: ${process.env.PORT}`);
});