$(document).ready(function () {

    function matchCustom(params, data) {
        if ($.trim(params.term) === '') {
            return data;
        }

        // Split the search term by the wildcard character '*'
        var terms = params.term.split('*').filter(function (term) {
            return term.length > 0;
        });

        // Check if all parts of the search term are present in the data text
        var match = true;
        for (var i = 0; i < terms.length; i++) {
            if (data.text.toUpperCase().indexOf(terms[i].toUpperCase()) === -1) {
                match = false;
                break;
            }
        }

        if (match) {
            return data;
        }

        return null;
    }

    $("#ProductoSeleccionado").select2({
        matcher: matchCustom
    });
    jQuery(document).ready(function ($) {
        Recuperar();
    });



    $(document).ready(function () {

    });


});

var Bodegas = []; // variables globales
var ProdClientes = [];
var ProdCadena = [];
var ProdPrueba = [];
var Categorias = [];
var Duplicado = false;
var Fechabool = false;
var ProdClientes2 = [];
var ProdSinStock = [];
var htmlS = "";
var inicio = true;
var Arqueos = [];
var MiSucursal = [];

function Recuperar() {
    try {


        Bodegas = JSON.parse($("#Bodegas").val());
        Productos = JSON.parse($("#Productos").val());
        Categorias = JSON.parse($("#Categorias").val());
        Arqueos = JSON.parse($("#Arqueo").val());
        MiSucursal = JSON.parse($("#MiSucursal").val());

        RellenaSucursales();
        RellenaCategorias();
        RecuperarInformacion();

        onChangeCategoria();

        //RellenaTabla();





    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }

}

function RellenaSucursales() {
    try {
        var html = "";
        $("#SucursalSeleccionado").html(html);

        html += "<option value='" + MiSucursal.CodSuc + "' > " + MiSucursal.CodSuc + " - " + MiSucursal.Nombre + " </option>";




        $("#SucursalSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}
function RecuperarInformacion() {
    try {

        $("#BodegaSeleccionado").val(Arqueos.idBodega);
        $("#CategoriaSeleccionado").val(Arqueos.idCategoria);
        $("#busqueda2").val(Arqueos.PalabraClave);
        $("#totCot").text(Arqueos.TotalCosto);
        $("#totDif").text(Arqueos.TotalCostoDiferencia);

        var FechaX = new Date(Arqueos.FechaCreacion);

        var Fecha = $.datepicker.formatDate('yy-mm-dd', FechaX);

        $("#Fecha").val(Fecha);

        for (var i = 0; i < Arqueos.Detalle.length; i++) {



            var Producto =
            {


                id: Arqueos.Detalle[i].id,
                idProducto: Arqueos.Detalle[i].idProducto,
                idEncabezado: Arqueos.Detalle[i].idEncabezado,
                Stock: Arqueos.Detalle[i].Stock,
                Total: parseFloat(Arqueos.Detalle[i].Total.toFixed(2)),
                Diferencia: parseFloat(Arqueos.Detalle[i].Diferencia.toFixed(2)),
                Costo: parseFloat(Arqueos.Detalle[i].Costo.toFixed(2)),
                CostoDiferencia: parseFloat(Arqueos.Detalle[i].CostoDiferencia.toFixed(2)),
                Contado: Arqueos.Detalle[i].Contado


            };
            ProdCadena.push(Producto);

            $("#BodegaSeleccionado").prop("disabled", true);
            $("#CategoriaSeleccionado").prop("disabled", true);
        }
    } catch (e) {

    }
}

function RellenaCategorias() {
    try {
        var html = "";
        $("#CategoriaSeleccionado").html(html);
        html += "<option value='0' > Seleccione Categoria </option>";

        for (var i = 0; i < Categorias.length; i++) {
            html += "<option value='" + Categorias[i].id + "' > " + Categorias[i].CodSAP + " - " + Categorias[i].Nombre + " </option>";
        }



        $("#CategoriaSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}


function RellenaBodegas() {
    try {
        var html = "";
        $("#BodegaSeleccionado").html(html);
        html += "<option value='0' > Seleccione Bodega </option>";

        for (var i = 0; i < Bodegas.length; i++) {
            html += "<option value='" + Bodegas[i].id + "' > " + Bodegas[i].CodSAP + " - " + Bodegas[i].Nombre + " </option>";
        }



        $("#BodegaSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function onChangeCategoria() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idBodega = $("#SucursalSeleccionado").val();

        var Categoria = Categorias.find(a => a.id == idCategoria);
        var filtro = $("#busqueda2").val();


        if (idCategoria != 0 && idBodega != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.Stock > 0);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.Stock == 0 && a.Nombre.includes(filtro));
            RellenaProductos();
            RellenaProductosSinStock();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.Stock > 0);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.Stock == 0 && a.Nombre.includes(filtro));
            RellenaProductos();
            RellenaProductosSinStock();
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }


}

function onChangeBodega() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idBodega = $("#SucursalSeleccionado").val();





        if (idCategoria != 0 && idBodega != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.Stock > 0);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.Stock == 0);

            RellenaProductos();
            RellenaProductosSinStock();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idBodega == 0 && a.Stock > 0);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.Stock == 0);
            RellenaProductos();
            RellenaProductosSinStock();
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }
}

function RellenaProductosSinStock() {
    try {
        var html = "";
        $("#ProductoSeleccionado").html(html);

        html += "<option value='0' > Seleccione Producto </option>";



        for (var i = 0; i < ProdClientes2.length; i++) {


            var Bodega = Bodegas.find(a => a.id == ProdClientes2[i].idBodega) == undefined ? undefined : Bodegas.find(a => a.id == ProdClientes2[i].idBodega);

            html += "<option value='" + ProdClientes2[i].id + "' > " + ProdClientes2[i].Codigo + " - " + ProdClientes2[i].Nombre + " -  BOD: " + Bodega.CodSAP + " </option>";



        }



        $("#ProductoSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}


function RellenaProductos() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idBodega = $("#SucursalSeleccionado").val();


        if (idCategoria != 0 && idBodega != 0) {
            RellenaTabla();
            filtrarTabla();
        }


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar facturas:  ' + e

        })
    }
}
function RellenaTabla() {
    try {
        var html = "";

        ProdClientes.sort(function (a, b) {
            var nombreA = a.Nombre.toLowerCase();
            var nombreB = b.Nombre.toLowerCase();

            if (nombreA < nombreB) return -1;
            if (nombreA > nombreB) return 1;
            return 0;
        });

        $("#tbody").html(html);


        for (var i = 0; i < ProdClientes.length; i++) {


            var idBodega = ProdClientes[i].idBodega;
            var Bodega = Bodegas.find(a => a.id == idBodega);

            html += "<tr>";


            html += "<td > " + ProdClientes[i].Codigo + "-" + ProdClientes[i].Nombre + " </td>";


            html += "<td > " + Bodega.CodSAP + " </td>";

            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Stock).toFixed(2)) + " </td>";




            html += "<td class='text-center'>  <input type='checkbox' id='" + i + "_mdcheckbox' class='chk-col-green' onchange='javascript: onChangeRevisado(" + i + ")'>  <label for='" + i + "_mdcheckbox'></label> </td> ";

            html += "<td class='text-center'> <input onchange='javascript: onChangeCantidad(" + i + ")' type='number' id='" + i + "_Cantidad1' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeCantidad(" + i + ")' type='number' id='" + i + "_Cantidad2' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeCantidad(" + i + ")' type='number' id='" + i + "_Cantidad3' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_Cantidad'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_Diferencia'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_Costo'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_CostoDiferencia'> 0 </td>";







            html += "</tr>";


        }

        $("#tbody").html(html);
        if (inicio) {

            for (var x = 0; x < ProdCadena.length; x++) {
                var id = ProdCadena[x].idProducto;
                var Existe = ProdClientes.find(a => a.id == id);

                if (!Existe) {
                    var PE = ProdClientes2.find(a => a.id == id);
                    ProdClientes.push(PE);
                    inicio = true;
                    RellenaTabla();
                    $("#ProductoSeleccionado").val("0").trigger('change.select2');

                }

            }
            RecuperarProdCadena();

        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function RecuperarProdCadena() {
    try {

        for (var i = 0; i < ProdCadena.length; i++) {

            var z = ProdClientes.findIndex(a => a.id == ProdCadena[i].idProducto);
            if (z != -1) {
                var x = ProdCadena.findIndex(a => a.idProducto == ProdClientes[z].id);
            } else {
                z = ProdClientes2.findIndex(a => a.id == ProdCadena[i].idProducto);
                var x = ProdCadena.findIndex(a => a.idProducto == ProdClientes2[z].id);
            }


            $("#" + z + "_Cantidad").val(ProdCadena[x].Total);
            $("#" + z + "_Diferencia").text(ProdCadena[x].Diferencia);
            $("#" + z + "_Costo").text(ProdCadena[x].Costo);
            $("#" + z + "_CostoDiferencia").text(ProdCadena[x].CostoDiferencia);

            $("#" + z + "_mdcheckbox").prop('checked', ProdCadena[x].Contado)
            var valorCheck = $("#" + z + "_mdcheckbox").prop('checked');


            if (valorCheck == true) {
                $("#" + z + "_Cantidad1").prop('disabled', true);
                $("#" + z + "_Cantidad2").prop('disabled', true);
                $("#" + z + "_Cantidad3").prop('disabled', true);
                var input = $("#" + z + "_Diferencia");
                var input2 = $("#" + z + "_CostoDiferencia");

                $("#" + z + "_Diferencia").text(ProdCadena[x].Diferencia);
                $("#" + z + "_Costo").text(ProdCadena[x].Costo);
                $("#" + z + "_Cantidad").text(ProdCadena[x].Total);
                $("#" + z + "_Diferencia").text(ProdCadena[x].Diferencia);
                $("#" + z + "_CostoDiferencia").text(ProdCadena[x].CostoDiferencia);


                if (ProdCadena[x].Diferencia == 0) {
                    input.css('background-color', '#EFFFE9')
                    input2.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                    input2.css('background-color', '#FFE9E9')
                }
            } else {
                $("#" + z + "_Diferencia").text(0);
                $("#" + z + "_Cantidad").text(0);
                $("#" + z + "_CostoDiferencia").text(0);
                $("#" + z + "_Costo").text(0);
      
                $("#" + z + "_Cantidad1").prop('disabled', false);
                $("#" + z + "_Cantidad2").prop('disabled', false);
                $("#" + z + "_Cantidad3").prop('disabled', false);
            }
        }






    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }
}
function onChangeCantidad(i) {
    try {


        var idCategoria = $("#CategoriaSeleccionado").val();
        var idBodega = $("#BodegaSeleccionado").val();

        var valorCheck = $("#" + i + "_mdcheckbox").prop('checked');


        var Existe = ProdCadena.find(a => a.idProducto == ProdClientes[i].id);
        var x = ProdCadena.findIndex(a => a.idProducto == ProdClientes[i].id);

        var PE = ProdClientes[i];
        if (Existe == undefined) {

            var Cantidad1 = parseFloat($("#" + i + "_Cantidad1").val());
            var Cantidad2 = parseFloat($("#" + i + "_Cantidad2").val());
            var Cantidad3 = parseFloat($("#" + i + "_Cantidad3").val());
            var TotalCantidad = Cantidad1 + Cantidad2 + Cantidad3;
            var TotalDiferencia = TotalCantidad - PE.Stock;
            var Costox = TotalCantidad * PE.Costo;
            var CostoDiferenciax = TotalDiferencia * PE.Costo;

            var Producto =
            {



                id: 0,
                idProducto: PE.id,
                idEncabezado: 0,
                Stock: PE.Stock,
                Total: TotalCantidad,
                Diferencia: TotalDiferencia,
                Costo: Costox,
                CostoDiferencia: CostoDiferenciax,
                Contado: $("#" + i + "_mdcheckbox").prop('checked')


            };

            if (valorCheck == true) {
                $("#" + i + "_Cantidad1").prop('disabled', true);
                $("#" + i + "_Cantidad2").prop('disabled', true);
                $("#" + i + "_Cantidad3").prop('disabled', true);
                var input = $("#" + i + "_Diferencia");
                var input2 = $("#" + i + "_CostoDiferencia");

                $("#" + i + "_Diferencia").text(TotalDiferencia);
                $("#" + i + "_Cantidad").text(TotalCantidad);
                $("#" + i + "_Costo").text(Costox);
                $("#" + i + "_CostoDiferencia").text(CostoDiferenciax); 

                if (TotalDiferencia == 0) {
                    input.css('background-color', '#EFFFE9')
                    input2.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                    input2.css('background-color', '#FFE9E9') 
                }
            } else {
                $("#" + i + "_Diferencia").text(0);
                $("#" + i + "_Cantidad").text(0);
                $("#" + i + "_CostoDiferencia").text(0);
                $("#" + i + "_Costo").text(0); 
                $("#" + i + "_Cantidad").prop('disabled', false);
            }

            ProdCadena.push(Producto);
        } else {
            var Cantidad1 = parseFloat($("#" + i + "_Cantidad1").val());
            var Cantidad2 = parseFloat($("#" + i + "_Cantidad2").val());
            var Cantidad3 = parseFloat($("#" + i + "_Cantidad3").val());
            var TotalCantidad = Cantidad1 + Cantidad2 + Cantidad3;
            var TotalDiferencia = TotalCantidad - PE.Stock;

            var Costox = TotalCantidad * PE.Costo;
            var CostoDiferenciax = TotalDiferencia * PE.Costo; 

            ProdCadena[x].idProducto = PE.id;
            ProdCadena[x].Stock = PE.Stock;
            ProdCadena[x].Total = TotalCantidad;
            ProdCadena[x].Diferencia = TotalDiferencia;
            ProdCadena[x].Contado = valorCheck;
            ProdCadena[x].Costo = Costox;
            ProdCadena[x].CostoDiferencia = CostoDiferenciax; 



            if (valorCheck == true) {
                $("#" + i + "_Cantidad1").prop('disabled', true);
                $("#" + i + "_Cantidad2").prop('disabled', true);
                $("#" + i + "_Cantidad3").prop('disabled', true);
                var input = $("#" + i + "_Diferencia");
                var input2 = $("#" + i + "_CostoDiferencia"); 

         
                $("#" + i + "_Cantidad").text(TotalCantidad);
                $("#" + i + "_Diferencia").text(TotalDiferencia);
                $("#" + i + "_Costo").text(Costox);
                $("#" + i + "_CostoDiferencia").text(CostoDiferenciax); 

                if (TotalDiferencia == 0) {
                    input.css('background-color', '#EFFFE9')
                    input2.css('background-color', '#EFFFE9') 
                } else {
                    input.css('background-color', '#FFE9E9')
                    input2.css('background-color', '#FFE9E9') 
                }
            } else {
                $("#" + i + "_Diferencia").text(0);
                $("#" + i + "_Cantidad").text(0);
                $("#" + i + "_CostoDiferencia").text(0);
                $("#" + i + "_Costo").text(0); 
                $("#" + i + "_Cantidad1").prop('disabled', false);
                $("#" + i + "_Cantidad2").prop('disabled', false);
                $("#" + i + "_Cantidad3").prop('disabled', false);
            }


        }
        ContarCostos();
        $("#BodegaSeleccionado").prop("disabled", true);
        $("#CategoriaSeleccionado").prop("disabled", true);


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }

}

function onChangeRevisado(i) {
    try {


        var idCategoria = $("#CategoriaSeleccionado").val();
        var idBodega = $("#BodegaSeleccionado").val();

        var valorCheck = $("#" + i + "_mdcheckbox").prop('checked');


        var Existe = ProdCadena.find(a => a.idProducto == ProdClientes[i].id);
        var x = ProdCadena.findIndex(a => a.idProducto == ProdClientes[i].id);

        var PE = ProdClientes[i];
        if (Existe == undefined) {

            var Cantidad1 = parseFloat($("#" + i + "_Cantidad1").val());
            var Cantidad2 = parseFloat($("#" + i + "_Cantidad2").val());
            var Cantidad3 = parseFloat($("#" + i + "_Cantidad3").val());
            var TotalCantidad = Cantidad1 + Cantidad2 + Cantidad3;
            var TotalDiferencia = TotalCantidad - PE.Stock;
            var Costox = TotalCantidad * PE.Costo;
            var CostoDiferenciax = TotalDiferencia * PE.Costo;
            var Producto =
            {



                id: 0,
                idProducto: PE.id,
                idEncabezado: 0,
                Stock: PE.Stock,
                Total: TotalCantidad,
                Diferencia: TotalDiferencia,
                Contado: valorCheck,
                Costo: Costox,
                CostoDiferencia: CostoDiferenciax


            };

            if (valorCheck == true) {
                $("#" + i + "_Cantidad1").prop('disabled', true);
                $("#" + i + "_Cantidad2").prop('disabled', true);
                $("#" + i + "_Cantidad3").prop('disabled', true);
                var input = $("#" + i + "_Diferencia");
                var input2 = $("#" + i + "_CostoDiferencia");

                $("#" + i + "_Diferencia").text(TotalDiferencia);
                $("#" + i + "_Cantidad").text(TotalCantidad);
                $("#" + i + "_Costo").text(Costox);
                $("#" + i + "_CostoDiferencia").text(CostoDiferenciax);

                if (TotalDiferencia == 0) {
                    input.css('background-color', '#EFFFE9')
                    input2.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                    input2.css('background-color', '#FFE9E9')
                }
            } else {
                $("#" + i + "_Diferencia").text(0);
                $("#" + i + "_Cantidad").text(0);
                $("#" + i + "_CostoDiferencia").text(0);
                $("#" + i + "_Costo").text(0);
                $("#" + i + "_Cantidad").prop('disabled', false);
            }

            ProdCadena.push(Producto);
        } else {
            var Cantidad1 = parseFloat($("#" + i + "_Cantidad1").val());
            var Cantidad2 = parseFloat($("#" + i + "_Cantidad2").val());
            var Cantidad3 = parseFloat($("#" + i + "_Cantidad3").val());
            var TotalCantidad = Cantidad1 + Cantidad2 + Cantidad3;
            var TotalDiferencia = TotalCantidad - PE.Stock;
  
            var Costox = TotalCantidad * PE.Costo;
            var CostoDiferenciax = TotalDiferencia * PE.Costo;

            ProdCadena[x].idProducto = PE.id;
            ProdCadena[x].Stock = PE.Stock;
            ProdCadena[x].Total = TotalCantidad;
            ProdCadena[x].Diferencia = TotalDiferencia;
            ProdCadena[x].Contado = valorCheck;
            ProdCadena[x].Costo = Costox;
            ProdCadena[x].CostoDiferencia = CostoDiferenciax;





            if (valorCheck == true) {
                $("#" + i + "_Cantidad1").prop('disabled', true);
                $("#" + i + "_Cantidad2").prop('disabled', true);
                $("#" + i + "_Cantidad3").prop('disabled', true);
                var input = $("#" + i + "_Diferencia");
                var input2 = $("#" + i + "_CostoDiferencia");

                $("#" + i + "_Cantidad").text(TotalCantidad);
                $("#" + i + "_Diferencia").text(TotalDiferencia);
                $("#" + i + "_Costo").text(Costox);
                $("#" + i + "_CostoDiferencia").text(CostoDiferenciax);


                if (TotalDiferencia == 0) {
                    input.css('background-color', '#EFFFE9')
                    input2.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                    input2.css('background-color', '#FFE9E9')
                }
            } else {
                $("#" + i + "_Diferencia").text(0);
                $("#" + i + "_Cantidad").text(0);
                $("#" + i + "_CostoDiferencia").text(0);
                $("#" + i + "_Costo").text(0);
                $("#" + i + "_Cantidad1").prop('disabled', false);
                $("#" + i + "_Cantidad2").prop('disabled', false);
                $("#" + i + "_Cantidad3").prop('disabled', false);
            }


        }
        ContarCostos();
        $("#BodegaSeleccionado").prop("disabled", true);
        $("#CategoriaSeleccionado").prop("disabled", true);

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }

}

function ContarCostos() {
    try {
        var Costo = 0;
        var Diferencia = 0;
        for (var i = 0; i < ProdCadena.length; i++) {
            Costo += ProdCadena[i].Costo;
            Diferencia += ProdCadena[i].CostoDiferencia;


        }
        $("#totCot").text(Costo);
        $("#totDif").text(Diferencia);


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error: ' + e

        })
    }
}

function AgregarProductoTabla() {
    try {


        var id = $("#ProductoSeleccionado").val();
        var PE = ProdClientes2.find(a => a.id == id);

        var Existe = ProdClientes.find(a => a.id == PE.id);

        if (!Existe) {
            ProdClientes.push(PE);
            inicio = true;
            RellenaTabla();
            $("#ProductoSeleccionado").val("0").trigger('change.select2');
            filtrarTabla()

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El producto ya fue añadido'

            })
        }







    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error: ' + e

        })
    }








}

function Generar() {

    try {
        var totCot = parseFloat($("#totCot").text());
        var totDif = parseFloat($("#totDif").text());
        var EncArqueos = {

            id: $("#id").val(),
            idCategoria: $("#CategoriaSeleccionado").val(),
            CodSuc: $("#SucursalSeleccionado").val(), 
            PalabraClave: $("#busqueda2").val(),
            idUsuarioCreador: 0,
            FechaCreacion: $("#Fecha").val(),
            Validado: false,
            Status: "P",
            FechaCreacion: $("#Fecha").val(),
            FechaActualizacion: $("#Fecha").val(),
            TotalCosto: totCot,
            TotalCostoDiferencia: totDif,
            Detalle: ProdCadena
        }

        if (validarArqueo(EncArqueos)) {
            Swal.fire({
                title: '¿Desea guardar la Toma Física?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: `Aceptar`,
                denyButtonText: `Cancelar`,
                customClass: {
                    confirmButton: 'swalBtnColor',
                    denyButton: 'swalDeny'
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    var jsonString = JSON.stringify(EncArqueos);
                    // Comprimir la cadena JSON utilizando gzip
                    var compressedData = pako.gzip(jsonString);

                    // Convertir los datos comprimidos a un ArrayBuffer (opcional, depende de tu caso de uso)
                    var compressedArrayBuffer = compressedData.buffer;

                    $.ajax({
                        type: 'POST',

                        url: $("#urlGenerar").val(),
                        dataType: 'json',
                        contentType: 'application/json',
                        data: compressedArrayBuffer,
                        processData: false,
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.arqueo);
                            if (json.success == true) {
                                $("#divProcesando").modal("hide");
                                Swal.fire({
                                    title: "Ha sido generado con éxito",

                                    icon: 'success',
                                    showCancelButton: false,

                                    confirmButtonText: 'OK',
                                    customClass: {
                                        confirmButton: 'swalBtnColor',

                                    },
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        //Despues de insertar, ocupariamos el id del cliente en la bd 
                                        //para entonces setearlo en el array de clientes

                                        window.location.href = window.location.href.split("/Editar")[0];


                                    }
                                })

                            } else {

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.arqueo

                                })
                            }
                        },

                        beforeSend: function () {
                            $("#divProcesando").modal("show");

                        },
                        complete: function () {
                            $("#divProcesando").modal("hide");

                        },
                        error: function (error) {
                            $("#divProcesando").modal("hide");

                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Ha ocurrido un error al intentar guardar ' + error

                            })
                        }
                    });
                }
            })
        } else {
            $("#divProcesando").modal("hide");

        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar agregar ' + e

        })
    }



}

function GeneraryEnviar() {

    try {
        var totCot = parseFloat($("#totCot").text());
        var totDif = parseFloat($("#totDif").text());

        var EncArqueos = {

            id: $("#id").val(),
            idCategoria: $("#CategoriaSeleccionado").val(),       
            CodSuc: $("#SucursalSeleccionado").val(), 
            PalabraClave: $("#busqueda2").val(),
            idUsuarioCreador: 0,
            FechaCreacion: $("#Fecha").val(),
            Validado: false,
            Status: "E",
            FechaCreacion: $("#Fecha").val(),
            FechaActualizacion: $("#Fecha").val(),
            TotalCosto: totCot,
            TotalCostoDiferencia: totDif,
            Detalle: ProdCadena
        }

        if (validarArqueo(EncArqueos)) {
            Swal.fire({
                title: '¿Desea enviar a revisión la Toma Física?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: `Aceptar`,
                denyButtonText: `Cancelar`,
                customClass: {
                    confirmButton: 'swalBtnColor',
                    denyButton: 'swalDeny'
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    var jsonString = JSON.stringify(EncArqueos);
                    // Comprimir la cadena JSON utilizando gzip
                    var compressedData = pako.gzip(jsonString);

                    // Convertir los datos comprimidos a un ArrayBuffer (opcional, depende de tu caso de uso)
                    var compressedArrayBuffer = compressedData.buffer;

                    $.ajax({
                        type: 'POST',

                        url: $("#urlGenerar").val(),
                        dataType: 'json',
                        contentType: 'application/json',
                        data: compressedArrayBuffer,
                        processData: false,
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.arqueo);
                            if (json.success == true) {
                                $("#divProcesando").modal("hide");
                                Swal.fire({
                                    title: "Ha sido generado con éxito",

                                    icon: 'success',
                                    showCancelButton: false,

                                    confirmButtonText: 'OK',
                                    customClass: {
                                        confirmButton: 'swalBtnColor',

                                    },
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        //Despues de insertar, ocupariamos el id del cliente en la bd 
                                        //para entonces setearlo en el array de clientes

                                        window.location.href = window.location.href.split("/Editar")[0];


                                    }
                                })

                            } else {

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.arqueo

                                })
                            }
                        },

                        beforeSend: function () {
                            $("#divProcesando").modal("show");

                        },
                        complete: function () {
                            $("#divProcesando").modal("hide");

                        },
                        error: function (error) {
                            $("#divProcesando").modal("hide");

                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Ha ocurrido un error al intentar guardar ' + error

                            })
                        }
                    });
                }
            })
        } else {
            $("#divProcesando").modal("hide");

        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar agregar ' + e

        })
    }



}
function validarArqueo(e) {
    try {


         if (e.idCategoria == "" || e.idCategoria == null || e.idCategoria == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Categoria'

            })
            return false;
        }





        else if (e.Detalle.lengh == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, por favor cuente al menos un producto'

            })
            return false;
        }

 



        else {
            return true;
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar agregar ' + e

        })
    }



}


function filtrarTabla() { //aRRIBA
    var busqueda = $("#busqueda2").val().toLowerCase();
    var busqueda2 = $("#busqueda").val().toLowerCase();
    var filas = $("#tbody tr");
    var indicesVisibles = [];

    filas.each(function (index) {
        var descripcion = $(this).find("td:eq(0)").text().toLowerCase();

        if (descripcion.includes(busqueda) && descripcion.includes(busqueda2)) {
            $(this).show();
            indicesVisibles.push(index);
        } else {
            $(this).hide();
        }
    });

    return indicesVisibles;
}





