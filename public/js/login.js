document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya hay un usuario en localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
        // Modificar formulario para mostrar que ya está logueado
        document.getElementById('login-form').innerHTML = `
            <div class="usuario-info">
                <h3>¡Bienvenido, ${usuario.nombre}!</h3>
                <p>Estás logueado con el correo ${usuario.email}</p>
                <button id="btn-logout" class="btn">Cerrar sesión</button>
            </div>
        `;
        
        // Manejar evento de cerrar sesión
        document.getElementById('btn-logout').addEventListener('click', () => {
            localStorage.removeItem('usuario');
            localStorage.removeItem('carrito');
            alert('Sesión cerrada correctamente');
            window.location.reload();
        });
    } else {
        // Manejar evento de envío del formulario
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            
            if (!nombre || !email || !direccion) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            try {
                // Aquí conectaríamos con el backend para guardar el usuario en Neo4j
                // Por ahora, solo guardamos en localStorage
                const usuario = { nombre, email, direccion };
                localStorage.setItem('usuario', JSON.stringify(usuario));
                
                alert('¡Inicio de sesión / registro exitoso!');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                alert('Error al iniciar sesión. Intente nuevamente más tarde.');
            }
        });
    }
});