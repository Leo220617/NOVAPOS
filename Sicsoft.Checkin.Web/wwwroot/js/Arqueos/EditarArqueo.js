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

        RellenaTabla();
        /*    filtrarTabla();*/




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
        $("#totCot").text(formatoDecimal(Arqueos.TotalCosto));
        $("#totDif").text(formatoDecimal(Arqueos.TotalCostoDiferencia));

        var FechaX = new Date(Arqueos.FechaCreacion);

        var Fecha = $.datepicker.formatDate('yy-mm-dd', FechaX);

        $("#Fecha").val(Fecha);

        for (var i = 0; i < Arqueos.Detalle.length; i++) {

            var PE = Productos.find(a => a.id == Arqueos.Detalle[i].idProducto);


            var Producto =
            {


                id: Arqueos.Detalle[i].id,
                idProducto: Arqueos.Detalle[i].idProducto,
                idEncabezado: Arqueos.Detalle[i].idEncabezado,
                Stock: Arqueos.Detalle[i].Stock,
                Total: parseFloat(Arqueos.Detalle[i].Total.toFixed(2)),
                Diferencia: parseFloat(Arqueos.Detalle[i].Diferencia.toFixed(2)),
                Costo: parseFloat(Arqueos.Detalle[i].Costo.toFixed(2)),
                CostoProducto: 0,
                CostoDiferencia: parseFloat(Arqueos.Detalle[i].CostoDiferencia.toFixed(2)),
                Contado: Arqueos.Detalle[i].Contado,
                Cantidad1: parseFloat(Arqueos.Detalle[i].Cantidad1.toFixed(2)),
                Cantidad2: parseFloat(Arqueos.Detalle[i].Cantidad2.toFixed(2)),
                Cantidad3: parseFloat(Arqueos.Detalle[i].Cantidad3.toFixed(2)),
                Nombre: PE.Nombre


            };
            if (Producto.Stock == 0) {
                Producto.CostoProducto = Producto.Costo;

            } else {

                Producto.CostoProducto = Producto.Costo / Producto.Stock;
            }
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
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.Stock == 0 && a.Nombre.toLowerCase().includes(filtro.toLowerCase()));

            RellenaProductos();
            RellenaProductosSinStock();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.Stock == 0 && a.Nombre.toLowerCase().includes(filtro.toLowerCase()));

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
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.Stock == 0);

            RellenaProductos();
            RellenaProductosSinStock();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idBodega == 0);
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
            /*   filtrarTabla();*/
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

        ProdCadena.sort(function (a, b) {
            var nombreA = a.Nombre.toLowerCase();
            var nombreB = b.Nombre.toLowerCase();

            if (nombreA < nombreB) return -1;
            if (nombreA > nombreB) return 1;
            return 0;
        });

        $("#tbody").html(html);


        for (var i = 0; i < ProdCadena.length; i++) {

            var PE = Productos.find(a => a.id == ProdCadena[i].idProducto);

            var idBodega = PE.idBodega;
            var Bodega = Bodegas.find(a => a.id == idBodega);

            html += "<tr>";


            html += "<td > " + PE.Codigo + "-" + PE.Nombre + " </td>";


            html += "<td > " + Bodega.CodSAP + " </td>";

            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].Stock).toFixed(2)) + " </td>";





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
            var x = i;

            $("#" + x + "_Cantidad1").val(ProdCadena[x].Cantidad1);
            $("#" + x + "_Cantidad2").val(ProdCadena[x].Cantidad2);
            $("#" + x + "_Cantidad3").val(ProdCadena[x].Cantidad3);
            $("#" + x + "_Cantidad").val(ProdCadena[x].Total);
            $("#" + x + "_Diferencia").text(ProdCadena[x].Diferencia);
            $("#" + x + "_Costo").text(ProdCadena[x].Costo);
            $("#" + x + "_CostoDiferencia").text(ProdCadena[x].CostoDiferencia);


            $("#" + x + "_mdcheckbox").prop('checked', ProdCadena[x].Contado)
            var valorCheck = $("#" + x + "_mdcheckbox").prop('checked');


            if (valorCheck == true) {
                $("#" + x + "_Cantidad1").prop('disabled', true);
                $("#" + x + "_Cantidad2").prop('disabled', true);
                $("#" + x + "_Cantidad3").prop('disabled', true);
                var input = $("#" + x + "_Diferencia");
                var input2 = $("#" + x + "_CostoDiferencia");

                $("#" + x + "_Diferencia").text(ProdCadena[x].Diferencia);
                $("#" + x + "_Costo").text(ProdCadena[x].Costo);
                $("#" + x + "_Cantidad").text(ProdCadena[x].Total);
                $("#" + x + "_Diferencia").text(ProdCadena[x].Diferencia);
                $("#" + x + "_CostoDiferencia").text(ProdCadena[x].CostoDiferencia);


                if (ProdCadena[x].Diferencia == 0) {
                    input.css('background-color', '#EFFFE9')
                    input2.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                    input2.css('background-color', '#FFE9E9')
                }
            } else {
                $("#" + x + "_Diferencia").text(0);
                $("#" + x + "_Cantidad").text(0);
                $("#" + x + "_CostoDiferencia").text(0);
                $("#" + x + "_Costo").text(0);

                $("#" + x + "_Cantidad1").prop('disabled', false);
                $("#" + x + "_Cantidad2").prop('disabled', false);
                $("#" + x + "_Cantidad3").prop('disabled', false);
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



        var x = ProdClientes.findIndex(a => a.id == ProdCadena[i].idProducto);

        var PE = ProdClientes[x];

        var Cantidad1 = parseFloat($("#" + i + "_Cantidad1").val());
        var Cantidad2 = parseFloat($("#" + i + "_Cantidad2").val());
        var Cantidad3 = parseFloat($("#" + i + "_Cantidad3").val());
        var TotalCantidad = Cantidad1 + Cantidad2 + Cantidad3;
        var TotalDiferencia = TotalCantidad - ProdCadena[i].Stock;

        var Costox = TotalCantidad * ProdCadena[i].CostoProducto;
        var CostoDiferenciax = TotalDiferencia * ProdCadena[i].CostoProducto;

        ProdCadena[i].idProducto = PE.id;
        //ProdCadena[x].Stock = PE.Stock;
        ProdCadena[i].Total = TotalCantidad;
        ProdCadena[i].Diferencia = TotalDiferencia;
        ProdCadena[i].Contado = valorCheck;
        ProdCadena[i].Costo = Costox;
        ProdCadena[i].CostoDiferencia = CostoDiferenciax;
        ProdCadena[i].Cantidad1 = Cantidad1;
        ProdCadena[i].Cantidad2 = Cantidad2;
        ProdCadena[i].Cantidad3 = Cantidad3;


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



        var x = ProdClientes.findIndex(a => a.id == ProdCadena[i].idProducto);

        var PE = ProdClientes[x];

        var Cantidad1 = parseFloat($("#" + i + "_Cantidad1").val());
        var Cantidad2 = parseFloat($("#" + i + "_Cantidad2").val());
        var Cantidad3 = parseFloat($("#" + i + "_Cantidad3").val());
        var TotalCantidad = Cantidad1 + Cantidad2 + Cantidad3;
        var TotalDiferencia = TotalCantidad - ProdCadena[i].Stock;

        var Costox = TotalCantidad * ProdCadena[i].CostoProducto;
        var CostoDiferenciax = TotalDiferencia * ProdCadena[i].CostoProducto;

        ProdCadena[i].idProducto = PE.id;
        //ProdCadena[x].Stock = PE.Stock;
        ProdCadena[i].Total = TotalCantidad;
        ProdCadena[i].Diferencia = TotalDiferencia;
        ProdCadena[i].Contado = valorCheck;
        ProdCadena[i].Costo = Costox;
        ProdCadena[i].CostoDiferencia = CostoDiferenciax;





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
        $("#totCot").text(formatoDecimal(Costo));
        $("#totDif").text(formatoDecimal(Diferencia));


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

        var Existe = ProdCadena.find(a => a.idProducto == PE.id);

        if (!Existe) {
            var Producto =
            {



                id: 0,
                idProducto: PE.id,
                idEncabezado: 0,
                Stock: PE.Stock,
                Total: 0,
                Diferencia: 0,
                Costo: PE.Costo,
                CostoProducto: PE.Costo,
                CostoDiferencia: PE.Costo,
                Contado: false,
                Cantidad1: 0,
                Cantidad2: 0,
                Cantidad3: 0,
                Nombre: PE.Nombre



            };

            ProdCadena.push(Producto);
            ProdClientes2.push(PE);
            inicio = true;
            RellenaTabla();
            $("#ProductoSeleccionado").val("0").trigger('change.select2');

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

                                        location.reload(); //window.location.href.split("/Editar")[0];


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



function filtrarTabla() {
    var busqueda = $("#busqueda2").val().toLowerCase().trim();
    var busqueda2 = $("#busqueda").val().toLowerCase().trim();
    var filas = $("#tbody tr");
    var indicesVisibles = [];

    filas.each(function (index) {
        var descripcion = $(this).find("td:eq(0)").text().toLowerCase().trim();

        // Extraer todo el texto después del primer guion
        var partes = descripcion.split('-');
        var palabraClave = partes.length > 1 ? partes[1].trim() : ''; // Toma la parte después del primer guion, si existe

        // Filtrar solo si 'busqueda' no está vacío
        if (busqueda) {
            // Verifica si la palabra clave comienza con 'busqueda'
            var coincidePalabraClave = palabraClave.startsWith(busqueda);

            if (coincidePalabraClave) {
                // Si 'busqueda2' está vacío o la descripción incluye 'busqueda2'
                if (!busqueda2 || descripcion.includes(busqueda2)) {
                    $(this).show();
                    indicesVisibles.push(index);
                } else {
                    $(this).hide();
                }
            } else {
                $(this).hide();
            }
        } else {
            $(this).hide(); // Si 'busqueda' está vacío, no muestra registros
        }
    });

    return indicesVisibles;
}


