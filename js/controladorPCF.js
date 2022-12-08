
var categorias = [
    {
        nombre: "Restaurantes",
        icono: "../img/restaurantes.jpg",
        empresas: [
            {
                nombreEmpresa: "Pizza Hut",
                icono: "../img/pizzaHut.jpg",
                productos: [
                    {
                        nombreProducto: "Pizza Suprema",
                        descripcion: "Incluye refresco y ensalada",
                        precio: 199,
                        icono: "../img/pizzaSuprema.jpg"
                    }
                ]
            },
            {
                nombreEmpresa: "Bigos",
                icono: "../img/bigos.jpg",
                productos: [
                    {
                        nombreProducto: "Hamburguesa Suprema",
                        descripcion: "Incluye refresco y papas fritas",
                        precio: 100,
                        icono: "../img/hamburguesaSuprema.jpg"
                    }
                ]
            }
        ]
    },
    {
        nombre: "Bebidas",
        icono: "../img/bebidas.jpg",
        empresas: [
            {
                nombreEmpresa: "Coca Cola",
                icono: "../img/cocaCola.jpg",
                productos: [
                    {
                        nombreProducto: "Coca cola 500ml",
                        descripcion: "Coca cola sabor original",
                        precio: 15,
                        icono: "../img/cocacolaBotella.png"
                    }
                ]
            },
            {
                nombreEmpresa: "Pepsi",
                icono: "../img/pepsi.jpg",
                productos: [
                    {
                        nombreProducto: "Pepsi 500ml",
                        descripcion: "Pepsi sabor original",
                        precio: 15,
                        icono: "../img/pepsiBotella.png"
                    }
                ]
            }
        ]
    }
];

var empresasCategoriaSeleccionada = [];

var seleccionCategoria;
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

function empresaSeleccionada(indice) {
    document.getElementById('paginaCategorias').style.display = 'none';
    document.getElementById('paginaProductos').style.display = 'block';
    document.getElementById('paginaEmpresas').style.display = 'none';
    document.getElementById('carrito').style.display = 'none';

    console.log(indice)
    seleccionEmpresa = seleccionCategoria.empresas[indice];
    document.getElementById('nombreEmpresa').innerHTML = `${seleccionEmpresa.nombreEmpresa}`
    cargarProductos();
}

function cargarProductos() {
    document.getElementById('productos').innerHTML = '';

    seleccionEmpresa.productos.forEach((producto, indice) => {
        document.getElementById('productos').innerHTML += 
        `
        <div class="tamano-opcion mt-4 border rounded-4 p-3 borde-color-primario">
                <div class="d-flex justify-content-between">
                    <div>
                        <h3 class="fs-4">${producto.nombreProducto}</h3>
                        <p>${producto.descripcion}</p>
                    </div>
                    <div>
                        <img src="${producto.icono}" alt="${producto.nombreProducto}" width="70">
                    </div> 
                </div>
                <div class="d-flex justify-content-between mt-2">
                    <div>
                        <h3>Lps. ${producto.precio}</h3>
                    </div>
                    <div>
                        <button id="decremento" class="btn-pequeno color-secundario-fondo color-texto-blanco" onclick="cambiarValor(this)">-</button>
                        <input type="number" min="0" max="10" value="0" step="1" value="0" id="cantidadProducto" readonly>
                        <button id="incremento" class="btn-pequeno color-secundario-fondo color-texto-blanco" onclick="cambiarValor(this)">+</button>
                    </div>
                </div>    
            </div>
        `
    })
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