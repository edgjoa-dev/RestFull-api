import { jest, test } from '@jest/globals';

// Mock del módulo mongoose usando unstable_mockModule para soporte ESM
jest.unstable_mockModule('mongoose', () => ({
    default: {
        connect: jest.fn(),
    },
}));

// Importamos dinámicamente después del mock
const mongoose = (await import('mongoose')).default;
const { dbConnection, resetConnectionPromise } = await import('./../../database/config.db.js');

describe('Pruebas de conexión a la base de datos (src/database/config.db.js)', () => {

    // Guardar una copia de la función original de console.log
    const originalConsoleLog = console.log;

    // Antes de cada prueba, mockeamos console.log para espiar sus llamadas
    beforeEach(() => {
        console.log = jest.fn();
        // Limpiamos los mocks para asegurar que los tests son independientes
        jest.clearAllMocks();
        // Reseteamos la promesa de conexión
        resetConnectionPromise();
    });

    // Después de todas las pruebas, restauramos la función original de console.log
    afterAll(() => {
        console.log = originalConsoleLog;
    });

    test('debe conectarse a la base de datos exitosamente', async () => {
        // Arrange: Preparamos el entorno para una conexión exitosa
        process.env.MONGO_URL = 'mongodb://test-url-exitosa';

        // Simulamos que la conexión de mongoose se resuelve correctamente
        mongoose.connect.mockResolvedValue();

        // Act: Ejecutamos la función que queremos probar
        await dbConnection();

        // Assert: Verificamos que todo funcionó como se esperaba
        expect(mongoose.connect).toHaveBeenCalledWith('mongodb://test-url-exitosa');
        expect(console.log).toHaveBeenCalledWith('Base de datos online');
    });

    test('debe lanzar un error si la conexión a la base de datos falla', async () => {
        // Arrange: Preparamos el entorno para una conexión fallida
        process.env.MONGO_URL = 'mongodb://test-url-fallida';
        const errorDeConexion = new Error('Fallo de conexión simulado');

        // Simulamos que la conexión de mongoose es rechazada con un error
        mongoose.connect.mockRejectedValue(errorDeConexion);

        // Act & Assert: Verificamos que la función lanza el error esperado
        await expect(dbConnection()).rejects.toThrow('Error al iniciar la base de datos');

        // Verificamos también que el error original fue capturado y mostrado en la consola
        expect(console.log).toHaveBeenCalledWith(errorDeConexion);
    });

    // 1) MONGO_URL undefined
    test('si MONGO_URL no está definida, llama a mongoose.connect con undefined y lanza en caso de fallo', async () => {
        delete process.env.MONGO_URL;
        mongoose.connect.mockResolvedValue(); // Si quieres simular éxito
        await dbConnection();
        expect(mongoose.connect).toHaveBeenCalledWith(undefined);
        expect(console.log).toHaveBeenCalledWith('Base de datos online');
    });

    // 2) MONGO_URL cadena vacía
    test('si MONGO_URL es cadena vacía, se pasa exactamente esa cadena a mongoose.connect', async () => {
        process.env.MONGO_URL = '';
        mongoose.connect.mockResolvedValue();
        await dbConnection();
        expect(mongoose.connect).toHaveBeenCalledWith('');
        expect(console.log).toHaveBeenCalledWith('Base de datos online');
    });

    // 3) mongoose.connect resuelve con un objeto (connection)
    test('cuando mongoose.connect resuelve con un objeto, la función completa sin retornar (comportamiento actual)', async () => {
        process.env.MONGO_URL = 'mongodb://test-url';
        const fakeConnection = { connectionString: 'mongodb://test-url', readyState: 1 };
        mongoose.connect.mockResolvedValue(fakeConnection);

        const result = await dbConnection();
        expect(result).toBeUndefined(); // actualmente tu función no retorna nada
        expect(mongoose.connect).toHaveBeenCalledWith('mongodb://test-url');
        expect(console.log).toHaveBeenCalledWith('Base de datos online');
    });

    // 4) mongoose.connect rechaza con un valor no Error (p.ej. string)
    test('si mongoose.connect rechaza con una string, debe loggear la string y seguir lanzando "Error al iniciar la base de datos"', async () => {
        process.env.MONGO_URL = 'mongodb://test-url';
        const weirdRejection = 'some-string-error';
        mongoose.connect.mockRejectedValue(weirdRejection);

        await expect(dbConnection()).rejects.toThrow('Error al iniciar la base de datos');
        expect(console.log).toHaveBeenCalledWith(weirdRejection);
    });

    test('si dbConnection es llamada dos veces, mongoose.connect solo se invoca una vez (cuando se cachea la promesa)', async () => {
        process.env.MONGO_URL = 'mongodb://test-url';
        mongoose.connect.mockResolvedValue();

        await dbConnection();
        await dbConnection();

        expect(mongoose.connect).toHaveBeenCalledTimes(1);
    });

});