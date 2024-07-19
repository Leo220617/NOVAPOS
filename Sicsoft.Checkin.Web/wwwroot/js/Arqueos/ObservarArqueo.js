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

function Recuperar() {
    try {


        Bodegas = JSON.parse($("#Bodegas").val());
        Productos = JSON.parse($("#Productos").val());
        Categorias = JSON.parse($("#Categorias").val());
        Arqueos = JSON.parse($("#Arqueo").val());
        RellenaBodegas();
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

function RecuperarInformacion() {
    try {

        $("#BodegaSeleccionado").val(Arqueos.idBodega);
        $("#CategoriaSeleccionado").val(Arqueos.idCategoria);

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

        var idBodega = $("#BodegaSeleccionado").val();

        var Categoria = Categorias.find(a => a.id == idCategoria);
        var Moneda = $("#MonedaSeleccionado").val();


        if (idCategoria != 0 && idBodega != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idBodega == idBodega && a.Stock > 0);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.idBodega == idBodega && a.Stock == 0);
            RellenaProductos();
            RellenaProductosSinStock();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idBodega == 0 && a.Stock > 0);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.idBodega == idBodega && a.Stock == 0);
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

        var idBodega = $("#BodegaSeleccionado").val();





        if (idCategoria != 0 && idBodega != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idBodega == idBodega && a.Stock > 0);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.idBodega == idBodega && a.Stock == 0);

            RellenaProductos();
            RellenaProductosSinStock();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idBodega == 0 && a.Stock > 0);
            ProdClientes2 = Productos.filter(a => a.idCategoria == idCategoria && a.idBodega == idBodega && a.Stock == 0);
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

        var idBodega = $("#BodegaSeleccionado").val();


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

        var idBodega = $("#BodegaSeleccionado").val();
        var Bodega = Bodegas.find(a => a.id == idBodega);
        

        $("#tbody").html(html);


        for (var i = 0; i < ProdCadena.length; i++) {

            var id = ProdCadena[i].idProducto;
            var Existe = ProdClientes.find(a => a.id == id);

            if (!Existe) {
                var PE = ProdClientes2.find(a => a.id == id);
             

            } else {
                var PE = ProdClientes.find(a => a.id == id);
            }
        
            html += "<tr>";


            html += "<td > " + PE.Codigo + "-" + PE.Nombre + " </td>";


            html += "<td > " + Bodega.CodSAP + " </td>";

            html += "<td class='text-right'> " + formatoDecimal(parseFloat(PE.Stock).toFixed(2)) + " </td>";




            html += "<td class='text-center'>  <input type='checkbox' id='" + i + "_mdcheckbox' class='chk-col-green' onchange='javascript: onChangeRevisado(" + i + ")'>  <label for='" + i + "_mdcheckbox'></label> </td> ";

            html += "<td > " + ProdCadena[i].Total + " </td>";
            if (ProdCadena[i].Diferencia == 0) {

                html += "<td class='text-center' style='background-color: #EFFFE9' id='" + i + "_Diferencia'> " + ProdCadena[i].Diferencia + "</td>";
            } else {
                html += "<td class='text-center' style='background-color: #FFE9E9' id='" + i + "_Diferencia'> " + ProdCadena[i].Diferencia + "</td>";
            }
          






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


function onChangeRevisado(i) {
    try {


        var idCategoria = $("#CategoriaSeleccionado").val();
        var idBodega = $("#BodegaSeleccionado").val();

        var valorCheck = $("#" + i + "_mdcheckbox").prop('checked');


        var Existe = ProdCadena.find(a => a.idProducto == ProdClientes[i].id);
        var x = ProdCadena.findIndex(a => a.idProducto == ProdClientes[i].id);

        var PE = ProdClientes[i];
        if (Existe == undefined) {

            var Cantidad = parseFloat($("#" + i + "_Cantidad").val());
            var TotalDiferencia = Cantidad - PE.Stock;
            var Producto =
            {



                id: 0,
                idProducto: PE.id,
                idEncabezado: 0,
                Stock: PE.Stock,
                Total: Cantidad,
                Diferencia: TotalDiferencia,
                Contado: valorCheck


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



function Generar() {

    try {

        var EncArqueos = {

            id: $("#id").val(),
            idCategoria: $("#CategoriaSeleccionado").val(),
            idBodega: $("#BodegaSeleccionado").val(),
            CodSuc: "",
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

        var EncArqueos = {

            id: $("#id").val(),
            idCategoria: $("#CategoriaSeleccionado").val(),
            idBodega: $("#BodegaSeleccionado").val(),
            CodSuc: "",
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



        if (e.idBodega == "" || e.idBodega == null || e.idBodega == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Bodega'

            })
            return false;
        }
        else if (e.idCategoria == "" || e.idCategoria == null || e.idCategoria == 0) {
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
        else if (e.Status == "E" && (e.Detalle.find(a => a.Contado == false) == true)) {
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
    var busqueda = $("#busqueda").val().toLowerCase();
    var filas = $("#tbody tr");
    var indicesVisibles = [];

    filas.each(function (index) {
        var descripcion = $(this).find("td:eq(0)").text().toLowerCase();

        if (descripcion.includes(busqueda)) {
            $(this).show();
            indicesVisibles.push(index);
        } else {
            $(this).hide();
        }
    });

    return indicesVisibles;
}





