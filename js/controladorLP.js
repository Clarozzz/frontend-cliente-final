var idUsuario = 0;
var usuarioActual;

function inicioSesion() {
    document.getElementById('navbar-inicio').style.display = 'none';
    document.getElementById('pagina-inicio').style.display = 'none';
    document.getElementById('apartado-registro').style.display = 'none';
    document.getElementById('apartado-inicio-sesion').style.display = 'block';
    document.body.style.backgroundColor = 'white';
}

function volverPaginaInicio() {
    document.getElementById('navbar-inicio').style.display = 'block';
    document.getElementById('pagina-inicio').style.display = 'block';
    document.getElementById('apartado-inicio-sesion').style.display = 'none';
    document.getElementById('apartado-registro').style.display = 'none';
    document.body.style.backgroundColor = '#FFAF54';
}

function abrirRegistro() {
    document.getElementById('navbar-inicio').style.display = 'none';
    document.getElementById('pagina-inicio').style.display = 'none';
    document.getElementById('apartado-registro').style.display = 'block';
    document.getElementById('apartado-inicio-sesion').style.display = 'none';
    document.body.style.backgroundColor = 'white';
}

async function abrirClientes() {
    let usuario = document.getElementById('usuario').value;
    let contrasena = document.getElementById('contrasena').value;

    const result = await fetch(`http://localhost:5005/usuarios/iniciar/${usuario}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let usuarioBack = await result.json();
    
    if (usuario == usuarioBack.usuario && contrasena == usuarioBack.contrasena){
        usuarioActual = usuarioBack;
        localStorage.setItem('usuario', JSON.stringify(usuarioActual));
        window.open('clientes.html', '_self');
    } else {
        document.getElementById('aviso').innerHTML = 'Usuario o contrasena incorrectos'
    }

}

async function crearNuevoUsuario() {
    let nombre = document.getElementById('nombreRegistro').value;
    let apellido = document.getElementById('apellidoRegistro').value;
    let usuario = document.getElementById('usuarioRegistro').value;
    let contrasena = document.getElementById('contrasenaRegistro').value;
    idUsuario += 1;

    const respuesta = await fetch('http://localhost:5005/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idUsuario: idUsuario,
            nombre: nombre,
            apellido: apellido,
            usuario: usuario,
            contrasena: contrasena,
            direccion: '',
            metodoPago: '',
            ordenes: []
        })
    });

    const resJSON = await respuesta.json();
    console.log('Respuesta', resJSON);
    location.reload();
}