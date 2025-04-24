// Función para cargar libros destacados en la página principal
async function cargarLibrosDestacados() {
    try {
        // Usar la URL completa incluyendo el puerto donde corre tu API
        const response = await fetch('http://localhost:3000/api/libros?limit=4');
        const data = await response.json();
        
        const contenedor = document.getElementById('libros-destacados');
        
        if (data.libros && data.libros.length > 0) {
            contenedor.innerHTML = '';
            
            data.libros.forEach(libro => {
                contenedor.innerHTML += `
                    <div class="libro-card">
                        <div class="libro-portada">
                            <img src="${libro.portada || '/img/portada-no-disponible.jpg'}" alt="${libro.titulo}">
                        </div>
                        <div class="libro-info">
                            <h3>${libro.titulo}</h3>
                            <p>${libro.autor}</p>
                            <p class="libro-precio">$${(Math.random() * 30 + 10).toFixed(2)}</p>
                            <button class="btn" onclick="agregarAlCarrito('${libro.id}', '${libro.fuente}')">
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                `;
            });
        } else {
            contenedor.innerHTML = '<p>No se encontraron libros destacados</p>';
        }
    } catch (error) {
        console.error('Error al cargar libros destacados:', error);
        document.getElementById('libros-destacados').innerHTML = 
            '<p>Error al cargar los libros destacados. Intente nuevamente más tarde.</p>';
    }
}

// Función para agregar un libro al carrito
function agregarAlCarrito(id, fuente) {
    // Verificar si el usuario está logueado
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) {
        alert('Debes iniciar sesión para agregar libros al carrito');
        window.location.href = 'login.html';
        return;
    }
    
    // Obtener el carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificar si el libro ya está en el carrito
    const libroEnCarrito = carrito.find(item => item.id === id);
    
    if (libroEnCarrito) {
        alert('Este libro ya está en tu carrito');
        return;
    }
    
    // Obtener detalles del libro y agregarlo al carrito
    fetch(`/api/libros/${id}?fuente=${fuente}`)
        .then(response => response.json())
        .then(libro => {
            // Agregar libro al carrito con cantidad 1
            carrito.push({
                ...libro,
                cantidad: 1,
                precio: (Math.random() * 30 + 10).toFixed(2) // Precio aleatorio entre 10 y 40
            });
            
            // Guardar carrito actualizado
            localStorage.setItem('carrito', JSON.stringify(carrito));
            
            alert('Libro agregado al carrito');
        })
        .catch(error => {
            console.error('Error al agregar libro al carrito:', error);
            alert('Error al agregar el libro al carrito');
        });
}

// Cargar libros destacados cuando se cargue la página
document.addEventListener('DOMContentLoaded', cargarLibrosDestacados);