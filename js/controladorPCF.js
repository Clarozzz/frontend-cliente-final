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
    console.log(ordenes);
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
            estado: ''
        })
    })

    const myModalEl = document.getElementById('modalOrdenar')
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
    obtenerOrdenes();
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

function verCarrito() {
    document.getElementById('paginaCategorias').style.display = 'none';
    document.getElementById('paginaProductos').style.display = 'none';
    document.getElementById('paginaEmpresas').style.display = 'none';
    document.getElementById('carrito').style.display = 'block';

    document.getElementById('iconoCarrito').style.display = 'none';
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

function metodoDePago() {
    document.getElementById('direccion').style.display = 'none';
    document.getElementById('metodoDePago').style.display = 'block';
}

function regresarADireccion() {
    document.getElementById('metodoDePago').style.display = 'none';
    document.getElementById('direccion').style.display = 'block';
}