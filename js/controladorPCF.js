
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
                        icono: "../img/cocacolaBotella.jpg"
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
                        icono: "../img/pepsiBotella.jpg"
                    }
                ]
            }
        ]
    }
];

var seleccionCategoria;
var seleccionEmpresa;

function generarCategorias() {
    document.getElementById('categorias').innerHTML = '';

    categorias.forEach((categoria, indice) => {
        document.getElementById('categorias').innerHTML += 
        `
        <div class="tamano-opcion mt-4">
            <img src="${categoria.icono}" alt="${categoria.nombre}" class="imagen shadow border border-2" onclick="categoriaSeleccionada(${indice})">
        </div>
        `
    })
}
generarCategorias();

function categoriaSeleccionada(indice) {
    document.getElementById('paginaCategorias').style.display = 'none';
    document.getElementById('paginaProductos').style.display = 'none';
    document.getElementById('paginaEmpresas').style.display = 'block';

    console.log(indice)
    seleccionCategoria = categorias[indice];
    cargarEmpresas();
}

function cargarEmpresas() {
    document.getElementById('empresas').innerHTML = '';

    seleccionCategoria.empresas.forEach((empresa, indice) => {
        document.getElementById('empresas').innerHTML += 
        `
        <div class="tamano-opcion mt-4">
            <img src="${empresa.icono}" alt="${empresa.nombreEmpresa}" class="imagen shadow border border-2" onclick="empresaSeleccionada(${indice})">
        </div>
        `
    })
}

function regresarACategorias() {
    document.getElementById('paginaCategorias').style.display = 'block';
    document.getElementById('paginaProductos').style.display = 'none';
    document.getElementById('paginaEmpresas').style.display = 'none';
}

function regresarAEmpresas() {
    document.getElementById('paginaCategorias').style.display = 'none';
    document.getElementById('paginaProductos').style.display = 'none';
    document.getElementById('paginaEmpresas').style.display = 'block';
}

function empresaSeleccionada(indice) {
    document.getElementById('paginaCategorias').style.display = 'none';
    document.getElementById('paginaProductos').style.display = 'block';
    document.getElementById('paginaEmpresas').style.display = 'none';

    console.log(indice)
    seleccionEmpresa = seleccionCategoria.empresas[indice];

    console.log(seleccionEmpresa)
}