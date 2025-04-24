# Proyecto Tienda de Libros en Línea

Este proyecto es una tienda de libros en línea que permite a los usuarios explorar, agregar y comprar libros. La aplicación está construida utilizando HTML, CSS y JavaScript, y se conecta a una base de datos Neo4j para gestionar la información de los libros.

## Estructura del Proyecto

```
tienda-libros-online
├── src
│   ├── assets
│   │   ├── css
│   │   │   ├── main.css
│   │   │   └── normalize.css
│   │   ├── js
│   │   │   ├── app.js
│   │   │   ├── carrito.js
│   │   │   └── catalogo.js
│   │   └── img
│   ├── components
│   │   ├── header.js
│   │   ├── footer.js
│   │   └── libro-card.js
│   ├── database
│   │   ├── neo4j-config.js
│   │   ├── queries.js
│   │   └── models.js
│   ├── pages
│   │   ├── home.html
│   │   ├── catalogo.html
│   │   ├── detalle-libro.html
│   │   ├── carrito.html
│   │   └── checkout.html
│   └── models
│       └── libro.js
├── index.html
├── package.json
└── README.md
```

## Descripción de Archivos

- **src/assets/css/**: Contiene los archivos CSS para el estilo de la tienda.
  - `main.css`: Estilos principales.
  - `normalize.css`: Normaliza estilos entre navegadores.

- **src/assets/js/**: Contiene los scripts JavaScript.
  - `app.js`: Script principal de la aplicación.
  - `carrito.js`: Lógica del carrito de compras.
  - `catalogo.js`: Maneja la visualización del catálogo de libros.

- **src/assets/img/**: Carpeta para las imágenes de las portadas de los libros.

- **src/components/**: Componentes reutilizables de la aplicación.
  - `header.js`: Componente del encabezado.
  - `footer.js`: Componente del pie de página.
  - `libro-card.js`: Componente que muestra la información de un libro.

- **src/database/**: Archivos relacionados con la base de datos Neo4j.
  - `neo4j-config.js`: Configuración de la conexión a la base de datos.
  - `queries.js`: Consultas a la base de datos.
  - `models.js`: Modelos de datos para interactuar con la base de datos.

- **src/pages/**: Páginas de la aplicación.
  - `home.html`: Página de inicio.
  - `catalogo.html`: Página del catálogo de libros.
  - `detalle-libro.html`: Página de detalles de un libro.
  - `carrito.html`: Página del carrito de compras.
  - `checkout.html`: Página de pago.

- **src/models/**: Modelos de datos.
  - `libro.js`: Define la estructura del modelo de libro.

- **index.html**: Punto de entrada de la aplicación.

- **package.json**: Configuración de npm, incluyendo dependencias y scripts.

## Instalación

1. Clona el repositorio.
2. Navega a la carpeta del proyecto.
3. Ejecuta `npm install` para instalar las dependencias.

## Uso

- Abre `index.html` en tu navegador para iniciar la aplicación.
- Explora el catálogo de libros, agrega libros al carrito y procede al pago.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.