var categorias;
var empresasCategoriaSeleccionada = [];
var productosEmpresaSeleccionada = [];
var productoSeleccionado;
var usuarioActual = JSON.parse(localStorage.getItem('usuario'));
var ordenes;
var seleccionEmpresa;

async function obtenerCategorias() {
    const result = await fetch('http://localhost:5005/categorias', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    categorias = await result.json();
}
obtenerCategorias().then(() => {
    generarCategorias();
});

async function obtenerOrdenes() {
    const result = await fetch('http://localhost:5005/ordenes', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    ordenes = await result.json();
}
obtenerOrdenes()

function generarCategorias() {
    document.getElementById('categorias').innerHTML = '';

    categorias.forEach((categoria) => {
        document.getElementById('categorias').innerHTML +=
            `
        <div class="tamano-opcion mt-4">
            <img src="${categoria.icono}" alt="${categoria.nombre}" class="imagen shadow border border-2" onclick="categoriaSeleccionada('${categoria._id}')">
        </div>
        `
    })
}

async function categoriaSeleccionada(idCategoria) {
    document.getElementById('paginaCategorias').style.display = 'none';
    document.getElementById('paginaProductos').style.display = 'none';
    document.getElementById('carrito').style.display = 'none';
    document.getElementById('paginaEmpresas').style.display = 'block';

    const result = await fetch(`http://localhost:5005/categorias/${idCategoria}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    seleccionCategoria = await result.json();
    obtenerEmpresas(seleccionCategoria.empresas);
}

async function obtenerEmpresas(empresas) {
    empresasCategoriaSeleccionada = [];
    for (let i = 0; i < empresas.length; i++) {
        const result = await fetch(`http://localhost:5005/empresas/empresas-categoria/${empresas[i]}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resJSON = await result.json();
        empresasCategoriaSeleccionada.push(resJSON);
    }
    cargarEmpresas();
}

function cargarEmpresas() {
    document.getElementById('empresas').innerHTML = '';

    empresasCategoriaSeleccionada.forEach((empresa) => {
        document.getElementById('empresas').innerHTML +=
            `
        <div class="tamano-opcion mt-4">
            <img src="${empresa.logo}" alt="${empresa.nombreEmpresa}" class="imagen shadow border border-2" onclick="empresaSeleccionada('${empresa._id}')">
        </div>
        `
    })
}

function regresarACategorias() {
    document.getElementById('paginaCategorias').style.display = 'block';
    document.getElementById('paginaProductos').style.display = 'none';
    document.getElementById('paginaEmpresas').style.display = 'none';
    document.getElementById('carrito').style.display = 'none';
    document.getElementById('iconoCarrito').style.display = 'block';
}

function regresarAEmpresas() {
    document.getElementById('paginaCategorias').style.display = 'none';
    document.getElementById('paginaProductos').style.display = 'none';
    document.getElementById('paginaEmpresas').style.display = 'block';
    document.getElementById('carrito').style.display = 'none';
}

async function empresaSeleccionada(idEmpresa) {
    document.getElementById('paginaCategorias').style.display = 'none';
    document.getElementById('paginaProductos').style.display = 'block';
    document.getElementById('paginaEmpresas').style.display = 'none';
    document.getElementById('carrito').style.display = 'none';

    const result = await fetch(`http://localhost:5005/empresas/${idEmpresa}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    seleccionEmpresa = await result.json();

    document.getElementById('nombreEmpresa').innerHTML = `${seleccionEmpresa.nombreEmpresa}`
    obtenerProductos(seleccionEmpresa.productos);
}

async function obtenerProductos(productos) {
    productosEmpresaSeleccionada = [];
    for (let i = 0; i < productos.length; i++) {
        const result = await fetch(`http://localhost:5005/productos/codigo-producto/${productos[i]}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resJSON = await result.json();
        productosEmpresaSeleccionada.push(resJSON);
    }
    cargarProductos();
}

function cargarProductos() {
    document.getElementById('productos').innerHTML = '';

    productosEmpresaSeleccionada.forEach((producto, indice) => {
        document.getElementById('productos').innerHTML +=
            `
        <div class="tamano-opcion mt-4 border rounded-4 p-3 borde-color-primario">
                <div class="d-flex justify-content-between">
                    <div>
                        <h3 class="fs-4">${producto.nombreProducto}</h3>
                        <p>${producto.descripcionProducto}</p>
                    </div>
                    <div>
                        <img src="${producto.image}" alt="${producto.nombreProducto}" width="70">
                    </div> 
                </div>
                <div class="d-flex justify-content-between mt-2">
                    <div>
                        <h3>Lps. ${producto.precio}</h3>
                    </div>
                    <div>
                        <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalOrdenar" onclick="modalOrdenar(${indice})">Ordenar</button>
                    </div>
                </div>    
            </div>
        `
    })
}

function modalOrdenar(indice) {
    productoSeleccionado = productosEmpresaSeleccionada[indice];
    document.getElementById('modalNombreProducto').innerHTML = productoSeleccionado.nombreProducto;
    document.getElementById('cantidadProducto').setAttribute("value", 0);
}

async function ordenar() {
    let cantidadOrdenar = parseInt(document.getElementById('cantidadProducto').value);
    let idOrden = (ordenes.length + 1);

    for (let i = 0; i < cantidadOrdenar; i++) {
        usuarioActual.ordenes.push(productoSeleccionado);
        const respuesta = await fetch('http://localhost:5005/ordenes', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                idOrden: idOrden,
                nombreCliente: usuarioActual.nombre,
                nombreProducto: productoSeleccionado.nombreProducto,
                descripcion: productoSeleccionado.descripcionProducto,
                direccion: usuarioActual.direccion,
                total: productoSeleccionado.precio,
                estado: 'Disponible'
            })
        })
        obtenerOrdenes();
        idOrden += 1;
    }

    const result = await fetch(`http://localhost:5005/usuarios/${usuarioActual._id}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: usuarioActual.nombre,
            apellido: usuarioActual.apellido,
            usuario: usuarioActual.usuario,
            contrasena: usuarioActual.contrasena,
            direccion: usuarioActual.direccion,
            metodoDePago: usuarioActual.metodoDePago,
            ordenes: usuarioActual.ordenes
        })
    });



    const myModalEl = document.getElementById('modalOrdenar')
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
}

function cambiarValor(btn) {
    const cantidadProducto = document.getElementById('cantidadProducto');
    let id = btn.getAttribute("id")
    let min = cantidadProducto.getAttribute("min");
    let max = cantidadProducto.getAttribute("max");
    let step = cantidadProducto.getAttribute("step");
    let val = cantidadProducto.getAttribute("value");
    let calcStep = (id == "incremento") ? (step * 1) : (step * -1);
    let nvoValor = parseInt(val) + calcStep;

    if (nvoValor >= min && nvoValor <= max) {
        cantidadProducto.setAttribute("value", nvoValor);
    }
}

async function verCarrito() {
    document.getElementById('paginaCategorias').style.display = 'none';
    document.getElementById('paginaProductos').style.display = 'none';
    document.getElementById('paginaEmpresas').style.display = 'none';
    document.getElementById('carrito').style.display = 'block';
    document.getElementById('iconoCarrito').style.display = 'none';

    document.getElementById('comprasCarrito').innerHTML = '';

    const result = await fetch(`http://localhost:5005/usuarios/${usuarioActual._id}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    });
    usuarioActual = await result.json();
    cargarOdenesCarrito();
}

function cargarOdenesCarrito() {
    console.log(usuarioActual.ordenes)
    let total = 0;
    usuarioActual.ordenes.forEach(orden => {
        document.getElementById('comprasCarrito').innerHTML +=
            `
        <div class="tamano-opcion mt-4 border rounded-4 p-3 borde-color-primario">
                <div class="d-flex justify-content-between">
                    <div>
                        <h3 class="fs-4">${orden.nombreProducto}</h3>
                        <p>${orden.descripcionProducto}</p>
                    </div>
                    <div style="width: 150px; height: 150px;">
                        <img src="${orden.image}" alt="${orden.nombreProducto}" width="100%" height="100%">
                    </div>
                </div>
            </div>
        `
        total += orden.precio;
    })

    document.getElementById('totalCompras').innerHTML = `Lps. ${total}`
}

function direccion() {
    document.getElementById('carrito').style.display = 'none';
    document.getElementById('direccion').style.display = 'block';
}

function regresarACarrito() {
    document.getElementById('paginaCategorias').style.display = 'none';
    document.getElementById('paginaProductos').style.display = 'none';
    document.getElementById('paginaEmpresas').style.display = 'none';
    document.getElementById('direccion').style.display = 'none';
    document.getElementById('carrito').style.display = 'block';
}

async function guardarDireccion() {
    usuarioActual.direccion = document.getElementById('direccionUsuario').value;

    const resUsuario = await fetch(`http://localhost:5005/usuarios/${usuarioActual._id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: usuarioActual.nombre,
            apellido: usuarioActual.apellido,
            usuario: usuarioActual.usuario,
            contrasena: usuarioActual.contrasena,
            direccion: usuarioActual.direccion,
            metodoDePago: usuarioActual.metodoDePago,
            ordenes: usuarioActual.ordenes
        })
    });

    for (let i = 0; i < ordenes.length; i++) {
        const resOrden = await fetch(`http://localhost:5005/ordenes/${ordenes[i]._id}`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idOrden: ordenes[i].idOrden,
                nombreCliente: ordenes[i].nombreCliente,
                nombreProducto: ordenes[i].nombreProducto,
                descripcion: ordenes[i].descripcion,
                direccion: usuarioActual.direccion,
                total: ordenes[i].total,
                estado: 'Disponible'
            })
        })
    }

    metodoDePago();
}

function metodoDePago() {
    document.getElementById('direccion').style.display = 'none';
    document.getElementById('metodoDePago').style.display = 'block';


}

async function guardarInfoPago() {
    let numTarjeta = document.getElementById('tarjeta').value;
    let ccv = document.getElementById('ccv').value;
    let caducidad = document.getElementById('caducidad').value;
    let metodoDePago = {
        numTarjeta: numTarjeta,
        ccv: ccv,
        caducidad: caducidad
    }

    const result = await fetch(`http://localhost:5005/usuarios/${usuarioActual._id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: usuarioActual.nombre,
            apellido: usuarioActual.apellido,
            usuario: usuarioActual.usuario,
            contrasena: usuarioActual.contrasena,
            direccion: usuarioActual.direccion,
            metodoPago: metodoDePago,
            ordenes: usuarioActual.ordenes
        })
    })

    location.reload();
}

function regresarADireccion() {
    document.getElementById('metodoDePago').style.display = 'none';
    document.getElementById('direccion').style.display = 'block';
}