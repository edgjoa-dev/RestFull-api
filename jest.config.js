// jest.config.js

/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',
    // Para asegurar la compatibilidad con ES Modules, jest.mock y las importaciones,
    // usamos @swc/jest para transformar el código antes de ejecutar los tests.
    // Esto es más robusto que el soporte nativo de ESM de Jest.
    transform: {
        '^.+\\.js$': '@swc/jest',
    },
};

export default config;