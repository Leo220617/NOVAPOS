
$(document).ready(function () {
    jQuery(document).ready(function ($) {
        Recuperar();
    });



    $(document).ready(function () {

    });


});


var Clientes = []; // variables globales
var Productos = [];
var ProdClientes = [];
var Impuestos = [];
var Cantones = [];
var Distritos = [];
var Barrios = [];
var ProdCadena = [];
var Exoneraciones = [];
var Documento = [];
var TipoCambio = [];
var MetodosPagos = [];

function Recuperar() {
    Cantones = JSON.parse($("#Cantones").val());
    Distritos = JSON.parse($("#Distritos").val());
    Barrios = JSON.parse($("#Barrios").val());
    Clientes = JSON.parse($("#Clientes").val());
    Productos = JSON.parse($("#Productos").val());
    Impuestos = JSON.parse($("#Impuestos").val());
    Exoneraciones = JSON.parse($("#Exoneraciones").val());
    Documento = JSON.parse($("#Documento").val());
    TipoCambio = JSON.parse($("#TipoCambio").val());

    ExoneracionesCliente = [];

    RellenaClientes();
  
    RecuperarInformacion();
}

function RecuperarInformacion() {
    try {
        $("#ClienteSeleccionado").val(Documento.idCliente);
        $("#Fecha").val(Documento.Fecha);

        $("#selectMoneda").val(Documento.Moneda);
        $("#selectTD").val("03");  

        $("#inputComentarios").val(Documento.Comentarios);
        $("#subG").text(formatoDecimal(Documento.Subtotal.toFixed(2)));
        $("#impG").text(formatoDecimal(Documento.TotalImpuestos.toFixed(2)));
        $("#descG").text(formatoDecimal(Documento.TotalDescuento.toFixed(2)));
        $("#totG").text(formatoDecimal(Documento.TotalCompra.toFixed(2)));
        $("#descuento").text(formatoDecimal(Documento.PorDescto.toFixed(2)));

        for (var i = 0; i < Documento.Detalle.length; i++) {
            var PE = Productos.find(a => a.id == Documento.Detalle[i].idProducto);

            var Producto =
            {
                idEncabezado: 0,
                Descripcion: PE.Codigo + " - " + PE.Nombre,
                Moneda: $("#selectMoneda").val(),
                idProducto: PE.id,
                NumLinea: 0,
                Cantidad: parseFloat(Documento.Detalle[i].Cantidad.toFixed(2)),
                TotalImpuesto: parseFloat(Documento.Detalle[i].TotalImpuesto.toFixed(2)),
                PrecioUnitario: parseFloat(Documento.Detalle[i].PrecioUnitario.toFixed(2)),
                PorDescto: parseFloat(Documento.Detalle[i].PorDescto.toFixed(2)),
                Descuento: parseFloat(Documento.Detalle[i].Descuento.toFixed(2)),
                TotalLinea: parseFloat(Documento.Detalle[i].TotalLinea.toFixed(2)),
                Cabys: Documento.Detalle[i].Cabys,
                idExoneracion: Documento.Detalle[i].Cabys,
                PorExoneracion: Exoneraciones.find(a => a.id == Documento.Detalle[i].idExoneracion) == undefined ? 0 : Exoneraciones.find(a => a.id == Documento.Detalle[i].idExoneracion).PorExon
            };
            ProdCadena.push(Producto);
        }
        RellenaTabla();
        onChangeCliente();


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}
 

function RellenaClientes() {
    var html = "";
    $("#ClienteSeleccionado").html(html);
    html += "<option value='0' > Seleccione Cliente </option>";

    for (var i = 0; i < Clientes.length; i++) {
        html += "<option value='" + Clientes[i].id + "' > " + Clientes[i].Codigo + " - " + Clientes[i].Nombre + " </option>";
    }



    $("#ClienteSeleccionado").html(html);
}
function RellenaProductos() {

    var html = "";
    $("#ProductoSeleccionado").html(html);

    html += "<option value='0' > Seleccione Producto </option>";

    for (var i = 0; i < ProdClientes.length; i++) {
        html += "<option value='" + ProdClientes[i].id + "' > " + ProdClientes[i].Codigo + " - " + ProdClientes[i].Nombre + " -  Precio: " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " -  Stock: " + formatoDecimal(parseFloat(ProdClientes[i].Stock).toFixed(2)) + " </option>";
    }



    $("#ProductoSeleccionado").html(html);
}

 

function onChangeCliente() {
    var idCliente = $("#ClienteSeleccionado").val();

    var Cliente = Clientes.find(a => a.id == idCliente);

    $("#spanDireccion").text(Cliente.Sennas);
    $("#strongInfo").text("Phone: " + Cliente.Telefono + " " + "  " + " " + "  " + "Email: " + Cliente.Email);

    ProdClientes = Productos.filter(a => a.idListaPrecios == Cliente.idListaPrecios);
    ProdClientes = ProdClientes.sort(function (a, b) {
        if (a.Stock < b.Stock) {
            return 1;
        }
        if (a.Stock > b.Stock) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });
    RellenaProductos();
    ValidarTotales();

}

 
function RellenaTabla() {
    var html = "";
    $("#tbody").html(html);


    for (var i = 0; i < ProdCadena.length; i++) {
        html += "<tr>";

        html += "<td> " + (i + 1) + " </td>";

        html += "<td > " + ProdCadena[i].Descripcion + " </td>";
        html += "<td class='text-center'> <input onchange='javascript: onChangeCantidadProducto("+i+")' type='number' id='" + i + "_Prod' class='form-control'   value= '" + formatoDecimal(parseFloat(ProdCadena[i].Cantidad).toFixed(2)) +"' min='1'/>  </td>";
        html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PrecioUnitario).toFixed(2)) + " </td>";
        html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].Descuento).toFixed(2)) + " </td>";
        html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].TotalImpuesto).toFixed(2)) + " </td>";
        html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PorExoneracion).toFixed(2)) + " </td>";
        html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].TotalLinea).toFixed(2)) + " </td>";
        html += "<td class='text-center'> <a class='fa fa-trash' onclick='javascript:EliminarProducto(" + i + ") '> </a> </td>";

        html += "</tr>";


    }



    $("#tbody").html(html);
}

function onChangeCantidadProducto(i) {
    try {
        ProdCadena[i].Cantidad = parseFloat($("#" + i + "_Prod").val()).toFixed(2);
        ValidarTotales();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}


function ValidarTotales() {
    try {
        var subtotalG = 0;
        var impuestoG = 0;
        var descuentoG = 0;
        var totalG = 0;

        for (var i = 0; i < ProdCadena.length; i++) {
            var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);
            var ImpuestoTarifa = PE.idImpuesto;
            var IMP = Impuestos.find(a => a.id == ImpuestoTarifa);

            var calculoIMP = IMP.Tarifa;

            ProdCadena[i].Descuento = (ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario) * (ProdCadena[i].PorDescto / 100);
            ProdCadena[i].TotalImpuesto = ((ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario) - ProdCadena[i].Descuento) * (calculoIMP / 100);
            //EX => Exoneracion
            var EX = Exoneraciones.find(a => a.id == ProdCadena[i].idExoneracion);
            if (EX != undefined) {
                var ValorExonerado = (EX.PorExon / 100);
                var TarifaExonerado = ((ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario) - ProdCadena[i].Descuento) * ValorExonerado;
                ProdCadena[i].TotalImpuesto -= TarifaExonerado;
                ProdCadena[i].PorExoneracion = EX.PorExon;
            }
                //Termina Exoneracion
            ProdCadena[i].TotalLinea = (ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario) - ProdCadena[i].Descuento + ProdCadena[i].TotalImpuesto;


            subtotalG += (ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario);
            impuestoG += ProdCadena[i].TotalImpuesto;
            descuentoG += ProdCadena[i].Descuento;
            totalG += ProdCadena[i].TotalLinea;

        }

        $("#subG").text(formatoDecimal(subtotalG.toFixed(2)));
        $("#descG").text(formatoDecimal(descuentoG.toFixed(2)));
        $("#impG").text(formatoDecimal(impuestoG.toFixed(2)));
        $("#totG").text(formatoDecimal(totalG.toFixed(2)));

        RellenaTabla();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}

function EliminarProducto(i) {

    var Producto = ProdCadena[i];



    var subtotalG = parseFloat(ReplaceLetra($("#subG").text()));
    var impuestoG = parseFloat(ReplaceLetra($("#impG").text()));
    var descuentoG = parseFloat(ReplaceLetra($("#descG").text()));
    var totalG = parseFloat(ReplaceLetra($("#totG").text()));

    subtotalG -= (Producto.Cantidad * Producto.PrecioUnitario);
    impuestoG -= Producto.TotalImpuesto;
    descuentoG -= Producto.Descuento;
    totalG -= Producto.TotalLinea;
    $("#subG").text(formatoDecimal(subtotalG.toFixed(2)));
    $("#descG").text(formatoDecimal(descuentoG.toFixed(2)));
    $("#impG").text(formatoDecimal(impuestoG.toFixed(2)));
    $("#totG").text(formatoDecimal(totalG.toFixed(2)));
    ProdCadena.splice(i, 1);
    RellenaTabla();
}

//Generar
function Generar() {
    try {


        var EncDocumento = {
            id: $("#id").val(),
            idCliente: $("#ClienteSeleccionado").val(),
            idUsuarioCreador: 0,
            Fecha: $("#Fecha").val(),
            FechaVencimiento: $("#Fecha").val(),
            Comentarios: $("#inputComentarios").val(),
            Subtotal: parseFloat(ReplaceLetra($("#subG").text())),
            TotalImpuestos: parseFloat(ReplaceLetra($("#impG").text())),
            TotalDescuento: parseFloat(ReplaceLetra($("#descG").text())),
            TotalCompra: parseFloat(ReplaceLetra($("#totG").text())),
            PorDescto: parseFloat(Documento.PorDescto),
            CodSuc: "",
            Moneda: $("#selectMoneda").val(),
            TipoDocumento: $("#selectTD").val(),
            // MetodosPagos: MetodosPagos,
            Detalle: ProdCadena
        }

        if (validarDocumento(EncDocumento)) {
            Swal.fire({
                title: '¿Desea editar el documento?',
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



                    $.ajax({
                        type: 'POST',

                        url: $("#urlGenerar").val(),
                        dataType: 'json',
                        data: { recibidos: EncDocumento },
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.Documento);
                            if (json.success == true) {
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

                                        window.location.href = window.location.href.split("/Cancelar")[0];


                                    }
                                })

                            } else {

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error al intentar guardar'

                                })
                            }
                        },

                        beforeSend: function (xhr) {


                        },
                        complete: function () {

                        },
                        error: function (error) {


                        }
                    });
                }
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Parece que faltan datos por llenar'

            })
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar agregar ' + e

        })
    }



}
//

function validarDocumento(e) {
    if (e.idCliente == "0" || e.idCliente == null) {
        return false;
    } else if (e.FechaVencimiento == "" || e.FechaVencimiento == null) {
        return false;
    }
    else if (e.Detalle.length == 0 || e.Detalle == null) {
        return false;
    }
    
    else {
        return true;
    }
}
function sumArray(array) {
    var suma = 0;
    for (var i = 0; i < array.length; i++) {
        suma += parseFloat(array[i].Monto);
    }
    return suma;
}
 

function cantidadRepetidos(palabra, separador) {


    return palabra.split(separador).length - 1;
}
function ReplaceLetra(palabra) {
    var cantidad = cantidadRepetidos(palabra, ",");
    for (var i = 0; i < cantidad; i++) {
        palabra = palabra.replace(",", "");
    }

    //var cantidad2 = cantidadRepetidos(palabra, ".");
    //for (var i = 0; i < cantidad2; i++) {
    //    palabra = palabra.replace(".", "");
    //}
    return palabra;
}

 