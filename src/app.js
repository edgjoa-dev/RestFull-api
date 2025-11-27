// Importamos la instancia de la app Express directamente
import app from './server.js';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
