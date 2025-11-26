// jest.config.js

/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',
    // No se necesita 'transform' si tus pruebas y tu código fuente usan ESM nativo
    // y estás en una versión de Node.js que lo soporta (como la v20 que usas).
};

export default config;