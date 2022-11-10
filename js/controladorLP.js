
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

function abrirClientes() {
    window.open('clientes.html', '_self');
}