const neo4j = require('neo4j-driver');
require('dotenv').config();

// Configuración de conexión con valores correctos
const URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const USER = process.env.NEO4J_USER || 'neo4j';
// Asegúrate de poner tu contraseña real aquí si no usas variables de entorno
const PASSWORD = process.env.NEO4J_PASSWORD || 'tu_contraseña_real';
const DATABASE = process.env.NEO4J_DATABASE || 'neo4j';

console.log('Conectando a Neo4j con:');
console.log(`- URI: ${URI}`);
console.log(`- Usuario: ${USER}`);
console.log(`- Base de datos: ${DATABASE}`);

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD), {
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 5000,
    disableLosslessIntegers: true
});

// Funciones para interactuar con Neo4j
async function verifyConnectivity() {
    try {
        await driver.verifyConnectivity();
        console.log('✅ Conexión a Neo4j establecida correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con Neo4j:', error);
        throw error;
    }
}

async function runQuery(cypher, params = {}) {
    const session = driver.session({ database: DATABASE });
    try {
        const result = await session.run(cypher, params);
        return result.records;
    } catch (error) {
        console.error('Error al ejecutar consulta en Neo4j:', error);
        throw error;
    } finally {
        await session.close();
    }
}

async function closeConnection() {
    try {
        await driver.close();
        console.log('🔒 Conexión a Neo4j cerrada correctamente');
    } catch (error) {
        console.error('Error al cerrar la conexión con Neo4j:', error);
        throw error;
    }
}

module.exports = {
    driver,
    runQuery,
    verifyConnectivity,
    closeConnection
};