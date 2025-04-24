const { runQuery } = require('../db/neo4jConnection');

/**
 * Crea un usuario en Neo4j o lo actualiza si ya existe
 */
async function crearUsuario(usuario) {
    const { nombre, email, direccion } = usuario;
    
    // Consulta para crear o actualizar un usuario
    const cypher = `
        MERGE (u:Usuario {email: $email})
        ON CREATE SET u.nombre = $nombre, u.direccion = $direccion, u.createdAt = datetime()
        ON MATCH SET u.nombre = $nombre, u.direccion = $direccion, u.updatedAt = datetime()
        RETURN u
    `;
    
    try {
        const result = await runQuery(cypher, { email, nombre, direccion });
        return result.length > 0;
    } catch (error) {
        console.error('Error al crear/actualizar usuario en Neo4j:', error);
        throw error;
    }
}

/**
 * Agrega un libro al carrito de un usuario en Neo4j
 */
async function agregarLibroAlCarrito(email, libro) {
    // Consulta para agregar libro al carrito
    const cypher = `
        MATCH (u:Usuario {email: $email})
        MERGE (l:Libro {id: $libroId, fuente: $fuente})
        ON CREATE SET l.titulo = $titulo, l.autor = $autor, l.portada = $portada,
                      l.descripcion = $descripcion
        MERGE (u)-[r:TIENE_EN_CARRITO]->(l)
        ON CREATE SET r.cantidad = $cantidad, r.fecha = datetime()
        ON MATCH SET r.cantidad = r.cantidad + $cantidad, r.fecha = datetime()
        
        // También creamos relación con categorías
        FOREACH (categoria IN $categorias |
            MERGE (c:Categoria {nombre: categoria})
            MERGE (l)-[:PERTENECE_A]->(c)
        )
        
        RETURN l
    `;
    
    const categorias = extraerCategoriasDesdeTitulo(libro.titulo);
    
    try {
        await runQuery(cypher, {
            email,
            libroId: libro.id,
            fuente: libro.fuente,
            titulo: libro.titulo,
            autor: libro.autor,
            portada: libro.portada || '',
            descripcion: libro.descripcion || '',
            cantidad: libro.cantidad || 1,
            categorias
        });
        
        return true;
    } catch (error) {
        console.error('Error al agregar libro al carrito en Neo4j:', error);
        throw error;
    }
}

/**
 * Obtiene recomendaciones de libros para un usuario basado en sus preferencias
 */
async function obtenerRecomendaciones(email) {
    // Consulta para obtener recomendaciones
    const cypher = `
        // Encontramos los libros que el usuario tiene en su carrito
        MATCH (u:Usuario {email: $email})-[:TIENE_EN_CARRITO]->(l:Libro)
        
        // Encontramos las categorías de estos libros
        MATCH (l)-[:PERTENECE_A]->(c:Categoria)
        
        // Encontramos otros libros que pertenecen a las mismas categorías 
        // pero que el usuario no tiene en su carrito
        MATCH (c)<-[:PERTENECE_A]-(otroLibro:Libro)
        WHERE NOT (u)-[:TIENE_EN_CARRITO]->(otroLibro)
        
        // Agrupamos y contamos para dar prioridad a libros que coinciden con más categorías
        WITH otroLibro, COUNT(DISTINCT c) as relevancia
        ORDER BY relevancia DESC
        LIMIT 5
        
        RETURN otroLibro.id as id, otroLibro.fuente as fuente, 
               otroLibro.titulo as titulo, otroLibro.autor as autor,
               otroLibro.portada as portada, otroLibro.descripcion as descripcion
    `;
    
    try {
        const result = await runQuery(cypher, { email });
        return result.map(record => ({
            id: record.get('id'),
            fuente: record.get('fuente'),
            titulo: record.get('titulo'),
            autor: record.get('autor'),
            portada: record.get('portada'),
            descripcion: record.get('descripcion')
        }));
    } catch (error) {
        console.error('Error al obtener recomendaciones en Neo4j:', error);
        throw error;
    }
}

/**
 * Función auxiliar para extraer posibles categorías del título de un libro
 */
function extraerCategoriasDesdeTitulo(titulo) {
    const categorias = [];
    const palabrasRelevantes = [
        'amor', 'romance', 'ciencia', 'ficción', 'historia', 'arte', 
        'economía', 'finanzas', 'programación', 'python', 'javascript', 
        'salud', 'cocina', 'recetas', 'viajes', 'poesía', 'terror',
        'aventura', 'biografía', 'misterio', 'fantasía', 'autoayuda'
    ];
    
    // Convertir a minúsculas y quitar caracteres especiales
    const tituloNormalizado = titulo.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ');
        
    // Buscar palabras relevantes en el título
    palabrasRelevantes.forEach(palabra => {
        if (tituloNormalizado.includes(palabra)) {
            categorias.push(palabra);
        }
    });
    
    // Si no encontramos categorías, agregar una genérica
    if (categorias.length === 0) {
        categorias.push('general');
    }
    
    return categorias;
}

module.exports = {
    crearUsuario,
    agregarLibroAlCarrito,
    obtenerRecomendaciones
};