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
var inicio = false;
var MiSucursal = [];

function Recuperar() {
    try {


        Bodegas = JSON.parse($("#Bodegas").val());
        Productos = JSON.parse($("#Productos").val());
        Categorias = JSON.parse($("#Categorias").val());
        MiSucursal = JSON.parse($("#MiSucursal").val());

        RellenaSucursales()
        RellenaCategorias()





    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
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

function onChangeCategoria() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idBodega = $("#SucursalSeleccionado").val();

        var Categoria = Categorias.find(a => a.id == idCategoria);
      


        if (idCategoria != 0 && idBodega != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.Stock > 0);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.Stock == 0);
            RellenaProductos();
            RellenaProductosSinStock();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.Stock > 0);
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
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.Stock > 0);
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




            html += "<td class='text-center'>  <input disabled type='checkbox' id='" + i + "_mdcheckbox' class='chk-col-green' onchange='javascript: onChangeRevisado(" + i + ")'>  <label for='" + i + "_mdcheckbox'></label> </td> ";
            html += "<td class='text-center'> <input disabled onchange='javascript: onChangeCantidad(" + i + ")' type='number' id='" + i + "_Cantidad1' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center'> <input disabled onchange='javascript: onChangeCantidad(" + i + ")' type='number' id='" + i + "_Cantidad2' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center'> <input disabled onchange='javascript: onChangeCantidad(" + i + ")' type='number' id='" + i + "_Cantidad3' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_Cantidad'> 0 </td>";
            html += "<td class='text-center' id='" + i + "_Diferencia'> 0 </td>";






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

            var z = ProdClientes.findIndex(a => a.id == ProdCadena[i].idProducto);
            if (z != -1) {
                var x = ProdCadena.findIndex(a => a.idProducto == ProdClientes[z].id);
            } else {
                z = ProdClientes2.findIndex(a => a.id == ProdCadena[i].idProducto);
                var x = ProdCadena.findIndex(a => a.idProducto == ProdClientes2[z].id);
            }


            $("#" + z + "_Cantidad").val(ProdCadena[x].Total);
            $("#" + z + "_Diferencia").text(ProdCadena[x].Diferencia);

            $("#" + z + "_mdcheckbox").prop('checked', ProdCadena[x].Contado)
            var valorCheck = $("#" + z + "_mdcheckbox").prop('checked');


            if (valorCheck == true) {
                $("#" + z + "_Cantidad").prop('disabled', true);
                var input = $("#" + z + "_Diferencia");

                $("#" + z + "_Diferencia").text(ProdCadena[x].Diferencia);


                if (ProdCadena[x].Diferencia == 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
            } else {
                $("#" + z + "_Diferencia").text(0);
                $("#" + z + "_Cantidad").prop('disabled', false);
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
        var idBodega = $("#SucursalSeleccionado").val();

        var valorCheck = $("#" + i + "_mdcheckbox").prop('checked');


        var Existe = ProdCadena.find(a => a.idProducto == ProdClientes[i].id);
        var x = ProdCadena.findIndex(a => a.idProducto == ProdClientes[i].id);

        var PE = ProdClientes[i];
        if (Existe == undefined) {

            var Cantidad = parseFloat($("#" + i + "_Cantidad").val());
            var Cantidad1 = parseFloat($("#" + i + "_Cantidad1").val());
            var Cantidad2 = parseFloat($("#" + i + "_Cantidad2").val());
            var Cantidad3 = parseFloat($("#" + i + "_Cantidad3").val());
            var TotalDiferencia = Cantidad - PE.Stock;
            var Producto =
            {



                id: 0,
                idProducto: PE.id,
                idEncabezado: 0,
                Stock: PE.Stock,
                Total: Cantidad,
                Diferencia: TotalDiferencia,
                Contado: $("#" + i + "_mdcheckbox").prop('checked'),
                Cantidad1: Cantidad1,
                Cantidad2: Cantidad2,
                Cantidad3: Cantidad3


            };

            if (valorCheck == true) {
                $("#" + i + "_Cantidad").prop('disabled', true);
                var input = $("#" + i + "_Diferencia");

                $("#" + i + "_Diferencia").text(TotalDiferencia);


                if (TotalDiferencia == 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
            } else {
                $("#" + i + "_Diferencia").text(0);
                $("#" + i + "_Cantidad").prop('disabled', false);
            }

            ProdCadena.push(Producto);
        } else {
            var Cantidad = parseFloat($("#" + i + "_Cantidad").val());
            var TotalDiferencia = Cantidad - PE.Stock;

            ProdCadena[x].idProducto = PE.id;
            ProdCadena[x].Stock = PE.Stock;
            ProdCadena[x].Total = Cantidad;
            ProdCadena[x].Diferencia = TotalDiferencia;




            if (valorCheck == true) {
                $("#" + i + "_Cantidad").prop('disabled', true);
                var input = $("#" + i + "_Diferencia");

                $("#" + i + "_Diferencia").text(TotalDiferencia);


                if (TotalDiferencia == 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
            } else {
                $("#" + i + "_Diferencia").text(0);
                $("#" + i + "_Cantidad").prop('disabled', false);
            }


        }

        $("#SucursalSeleccionado").prop("disabled", true);
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
        var idBodega = $("#SucursalSeleccionado").val();

        var valorCheck = $("#" + i + "_mdcheckbox").prop('checked');


        var Existe = ProdCadena.find(a => a.idProducto == ProdClientes[i].id);
        var x = ProdCadena.findIndex(a => a.idProducto == ProdClientes[i].id);

        var PE = ProdClientes[i];
        if (Existe == undefined) {

            var Cantidad = parseFloat($("#" + i + "_Cantidad").val());
            var Cantidad1 = parseFloat($("#" + i + "_Cantidad1").val());
            var Cantidad2 = parseFloat($("#" + i + "_Cantidad2").val());
            var Cantidad3 = parseFloat($("#" + i + "_Cantidad3").val());
            var TotalDiferencia = Cantidad - PE.Stock;
            var Producto =
            {



                id: 0,
                idProducto: PE.id,
                idEncabezado: 0,
                Stock: PE.Stock,
                Total: Cantidad,
                Diferencia: TotalDiferencia,
                Contado: valorCheck,
                Cantidad1: Cantidad1,
                Cantidad2: Cantidad2,
                Cantidad3: Cantidad3
                


            };

            if (valorCheck == true) {
                $("#" + i + "_Cantidad").prop('disabled', true);
                var input = $("#" + i + "_Diferencia");

                $("#" + i + "_Diferencia").text(TotalDiferencia);


                if (TotalDiferencia == 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
            } else {
                $("#" + i + "_Diferencia").text(0);
                $("#" + i + "_Cantidad").prop('disabled', false);
            }

            ProdCadena.push(Producto);
        } else {
            var Cantidad = parseFloat($("#" + i + "_Cantidad").val());
            var TotalDiferencia = Cantidad - PE.Stock;

            ProdCadena[x].idProducto = PE.id;
            ProdCadena[x].Stock = PE.Stock;
            ProdCadena[x].Total = Cantidad;
            ProdCadena[x].Diferencia = TotalDiferencia;
            ProdCadena[x].Contado = valorCheck;




            if (valorCheck == true) {
                $("#" + i + "_Cantidad").prop('disabled', true);
                var input = $("#" + i + "_Diferencia");

                $("#" + i + "_Diferencia").text(TotalDiferencia);


                if (TotalDiferencia == 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
            } else {
                $("#" + i + "_Diferencia").text(0);
                $("#" + i + "_Cantidad").prop('disabled', false);
            }


        }

        $("#SucursalSeleccionado").prop("disabled", true);
        $("#CategoriaSeleccionado").prop("disabled", true);

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
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

        var EncArqueos = {

            id: 0,
            idCategoria: $("#CategoriaSeleccionado").val(),
            PalabraClave: $("#busqueda2").val(),
            CodSuc: $("#SucursalSeleccionado").val(),
            idUsuarioCreador: 0,
            FechaCreacion: $("#Fecha").val(),
            Validado: false,
            Status: "P",
            FechaCreacion: $("#Fecha").val(),
            FechaActualizacion: $("#Fecha").val(),
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

                                        window.location.href = window.location.href.split("/Nuevo")[0];


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

        var EncArqueos = {

            id: 0,
            idCategoria: $("#CategoriaSeleccionado").val(),
            PalabraClave: $("#busqueda2").val(),
            CodSuc: $("#SucursalSeleccionado").val(),
            idUsuarioCreador: 0,
            FechaCreacion: $("#Fecha").val(),
            Validado: false,
            Status: "E",
            FechaCreacion: $("#Fecha").val(),
            FechaActualizacion: $("#Fecha").val(),
            Detalle: ProdCadena
        }

        if (validarArqueo(EncArqueos)) {
            Swal.fire({
                title: '¿Desea enviar a revisión  la Toma Física?',
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

                                        window.location.href = window.location.href.split("/Nuevo")[0];


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



//function filtrarTabla() {
//    var busqueda = $("#busqueda2").val().toLowerCase();
//    var busqueda2 = $("#busqueda").val().toLowerCase();
//    var filas = $("#tbody tr");
//    var indicesVisibles = [];

//    filas.each(function (index) {
//        var descripcion = $(this).find("td:eq(0)").text().toLowerCase().trim();
//        var primeraPalabra = descripcion.split(/\s+/)[0]; // Extrae la primera palabra

//        if (busqueda && !busqueda2) {
//            // Si hay busqueda en "busqueda2" y no en "busqueda", filtra por la primera palabra
//            if (primeraPalabra.includes(busqueda)) {
//                $(this).show();
//                indicesVisibles.push(index);
//            } else {
//                $(this).hide();
//            }
//        } else if (!busqueda && busqueda2) {
//            // Si hay busqueda en "busqueda2", filtra toda la descripción
//            if (descripcion.includes(busqueda2)) {
//                $(this).show();
//                indicesVisibles.push(index);
//            } else {
//                $(this).hide();
//            }
//        } else if (busqueda && busqueda2) {
//            // Si hay búsqueda en ambos, usa ambos criterios
//            if (primeraPalabra.includes(busqueda) && descripcion.includes(busqueda2)) {
//                $(this).show();
//                indicesVisibles.push(index);
//            } else {
//                $(this).hide();
//            }
//        }
//    });

//    return indicesVisibles;
//}
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
