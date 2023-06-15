$(document).ready(function () {
    jQuery(document).ready(function ($) {
        Recuperar();
    });



    $(document).ready(function () {

    });


});

var Clientes = []; // variables globales
var DocumentoC = [];
var ProdClientes = [];
var Impuestos = [];
var ProdCadena = [];
var TipoCambio = [];
var Documento = [];
var CP = [];
var Vendedores = [];
var DetallePago = [];

function Recuperar() {
    try {


        Clientes = JSON.parse($("#Clientes").val());
        Vendedores = JSON.parse($("#Vendedores").val());
        Productos = JSON.parse($("#Productos").val());

        TipoCambio = JSON.parse($("#TipoCambio").val());
        Documento = JSON.parse($("#Documento").val());
        CP = JSON.parse($("#CP").val());


        RellenaClientes();


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }

}




function RellenaClientes() {
    try {
        var html = "";
        $("#ClienteSeleccionado").html(html);
        html += "<option value='0' > Seleccione Cliente </option>";

        for (var i = 0; i < Clientes.length; i++) {
            html += "<option value='" + Clientes[i].id + "' > " + Clientes[i].Codigo + " - " + Clientes[i].Nombre + " </option>";
        }


        $("#ClienteSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}
function onChangeCliente() {
    try {
        var idCliente = $("#ClienteSeleccionado").val();

        var Cliente = Clientes.find(a => a.id == idCliente);

        var CondP = CP.filter(a => a.id == Cliente.idCondicionPago);

        $("#spanDireccion").text(Cliente.Sennas);
        $("#strongInfo").text("Phone: " + Cliente.Telefono + " " + "  " + " " + "  " + "Email: " + Cliente.Email);
        $("#strongInfo2").text("Saldo: " + formatoDecimal(Cliente.Saldo.toFixed(2)) + " " + "  " + " " + "  " + "Limite Credito: " + formatoDecimal(Cliente.LimiteCredito.toFixed(2)));
        RecolectarFacturas();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }


}

function RecolectarFacturas() {
    try {
        var idClientes = $("#ClienteSeleccionado").val();

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: $("#urlFacturas").val(),
            data: { idCliente: idClientes },
            success: function (result) {

                if (result == null) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ha ocurrido un error al intentar recuperar facturas'

                    })

                } else {
                    console.log(result);
                    result = result.filter(a => a.moneda == $("#selectMoneda").val() && a.status != "C");
                    ProdCadena = result;
                    RellenaTabla();
                }
            },
            beforeSend: function () {

            }
        })

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar facturas:  ' + e

        })
    }
}
function onChangeMoneda() {
    try {
        RecolectarFacturas();
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
        $("#tbody").html(html);


        for (var i = 0; i < ProdCadena.length; i++) {
            html += "<tr>";
            html += "<td> <input type='checkbox' id='" + i + "_mdcheckbox' class='chk-col-green' onchange='javascript: onChangeRevisado(" + i + ")'>  <label for='" + i + "_mdcheckbox'></label> </td> ";
            if ($("#RolSinInteres").val() == "value") {
                html += "<td> <input type='checkbox' id='" + i + "_mdcheckboxI' class='chk-col-green' onchange='javascript: onChangeInteres(" + i + ")'>  <label for='" + i + "_mdcheckboxI'></label> </td> ";
            }

            html += "<td > " + ProdCadena[i].docNum + " </td>";
            html += "<td > " + ProdCadena[i].consecutivoHacienda + " </td>";
            //var CondP = CP.find(a => a.id == ProdCadena[i].idCondPago);
            //html += "<td > " + CondP.Nombre + " </td>";

            //html += "<td > " + ProdCadena[i].fecha.toString().split("T")[0] + " </td>";
            //html += "<td > " + ProdCadena[i].fechaVencimiento.toString().split("T")[0] + " </td>";


            var fechaInicio = new Date(ProdCadena[i].fechaVencimiento).getTime();
            var fechaFin = new Date(Date.now()).getTime();
            var diff = fechaFin - fechaInicio;
            var diferencia = diff / (1000 * 60 * 60 * 24);
            var interes = 0;

            if (diferencia > 10) {
                interes = (ProdCadena[i].saldo * 0.0005) * (diferencia - 10);

            }

            html += "<td > " + formatoDecimal(parseFloat(diferencia).toFixed(0)) + " </td>";
            html += "<td hidden> " + ProdCadena[i].moneda + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].totalCompra).toFixed(2)) + " </td>";
            html += "<td class='text-right'  > " + formatoDecimal(parseFloat(ProdCadena[i].saldo).toFixed(2)) + " </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeMonto(" + i + ")' type='number' id='" + i + "_Fac' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td hidden id='" + i + "_Cap'> " + 0 + " </td>";
            html += "<td  id='" + i + "_CapS' class='text-right'> " + 0 + " </td>";

            html += "<td hidden id='" + i + "_IntX' > " + 0 + " </td>";
            html += "<td  id='" + i + "_IntXS' class='text-right'> " + 0 + " </td>";

            html += "<td hidden id='" + i + "_Int'> " + interes.toFixed(2) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(interes).toFixed(2)) + " </td>";

            html += "<td class='text-center'> <a class='fa fa-info-circle icono' onclick='javascript:AbrirModalEdicion(" + ProdCadena[i].id + ") '> </a> </td>";

            html += "</tr>";


        }

        $("#tbody").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}


function onChangeInteres(i) {
    try {
        var idCliente = $("#ClienteSeleccionado").val();

        var Cliente = Clientes.find(a => a.id == idCliente);


        var valorCheck = $("#" + i + "_mdcheckboxI").prop('checked');



        if (valorCheck == true && Cliente.INT == true) {



        } else if (Cliente.INT == false) {
            $("#" + i + "_mdcheckboxI").prop('checked', false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El cliente no tiene disponible la opción de no pagar intéreses '

            })

        }

        onChangeMonto(i);


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error, ' + e

        })
    }
}
function AbrirModal() {
    try {
        $("#ModalInclusion").modal("show");
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar abrir modal ' + e

        })
    }

}
function onChangeMonto(i) {
    try {

        var Fac = DetallePago.find(a => a.idEncDocumentoCredito == ProdCadena[i].id);

        var fechaInicio = new Date(ProdCadena[i].fechaVencimiento).getTime();
        var fechaFin = new Date(Date.now()).getTime();
        var diff = fechaFin - fechaInicio;
        var diferencia = diff / (1000 * 60 * 60 * 24);
        var interes = 0;
        var TotalF = 0;

        var valorCheck = $("#" + i + "_mdcheckboxI").prop('checked');


        if (diferencia > 10) {
            interes = (ProdCadena[i].saldo * 0.0005) * (diferencia - 10);
        }

        TotalF = ProdCadena[i].saldo + interes;

        if (valorCheck == true) {
            if ($("#" + i + "_Fac").val() > ProdCadena[i].saldo) {
                $("#" + i + "_Fac").val(ProdCadena[i].saldo);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El valor digitado es mayor al saldo faltante '

                });
            }

        } else {
            if ($("#" + i + "_Fac").val() > (TotalF + 0.5)) {
                $("#" + i + "_Fac").val(TotalF.toFixed(2));
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El valor digitado es mayor al saldo faltante con intéreses'

                });
            }
        }





        if (Fac == undefined && parseFloat($("#" + i + "_Fac").val()) > 0) {
             

            var detalle = {
                id: 0,
                idEncabezado: 0,
                idEncDocumentoCredito: ProdCadena[i].id,
                NumLinea: 0,
                Total: parseFloat($("#" + i + "_Fac").val()),
                Interes: parseFloat($("#" + i + "_IntX").text()),
                Capital: parseFloat($("#" + i + "_Cap").text()),
            };
            DetallePago.push(detalle);
            CalcularInteresyCapital(i)

        } else {
            if (parseFloat($("#" + i + "_Fac").val()) == 0) {

                var posicion = DetallePago.indexOf(Fac);
                DetallePago.splice(posicion, 1);
                CalcularInteresyCapital(i);
            } else if (parseFloat($("#" + i + "_Fac").val()) > 0) {
                CalcularInteresyCapital(i);
                var posicion = DetallePago.indexOf(Fac);

                if (posicion >= 0) { 
                DetallePago[posicion].Total = parseFloat($("#" + i + "_Fac").val());
                DetallePago[posicion].Interes = parseFloat($("#" + i + "_IntX").val());
                DetallePago[posicion].Capital = parseFloat($("#" + i + "_Cap").val());
                }


            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Valor no puede ser menor a 0'

                })
                $("#" + i + "_Fac").val(0);
            }
        }

        if (DetallePago.length > 0) {
            $('#selectMoneda').prop('disabled', true);
            $('#ClienteSeleccionado').prop('disabled', true);

        } else {
            $('#selectMoneda').prop('disabled', false);
            $('#ClienteSeleccionado').prop('disabled', false);

        }


        calculaTotalPago();

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar insertar pago ' + e

        })
    }
}

function CalcularInteresyCapital(i) {
    try {
        var Fac = DetallePago.find(a => a.idEncDocumentoCredito == ProdCadena[i].id);


        var fechaInicio = new Date(ProdCadena[i].fechaVencimiento).getTime();
        var fechaFin = new Date(Date.now()).getTime();
        var diff = fechaFin - fechaInicio;
        var diferencia = diff / (1000 * 60 * 60 * 24);
        var interes = 0;
        var FacyInt = 0;
        var PorCompra = 0;
        var MontoDigitado = $("#" + i + "_Fac").val();
        var InteresLinea = 0;
        var CapitalLinea = 0;
        var valorCheck = $("#" + i + "_mdcheckboxI").prop('checked');

        if (diferencia > 10 && valorCheck == false) {
            interes = (ProdCadena[i].saldo * 0.0005) * (diferencia - 10);
            FacyInt = interes + ProdCadena[i].saldo;
            PorCompra = (MontoDigitado / FacyInt);
            CapitalLinea = ProdCadena[i].saldo * PorCompra;
            InteresLinea = MontoDigitado - CapitalLinea;

            $("#" + i + "_Cap").val(CapitalLinea.toFixed(2));
            $("#" + i + "_CapS").text(formatoDecimal(CapitalLinea.toFixed(2)));
            $("#" + i + "_IntX").val(InteresLinea.toFixed(2));
            $("#" + i + "_IntXS").text(formatoDecimal(InteresLinea.toFixed(2)));

            var posicion = DetallePago.indexOf(Fac);

            if (posicion >= 0) {
                DetallePago[posicion].Total = parseFloat($("#" + i + "_Fac").val());
                DetallePago[posicion].Interes = parseFloat($("#" + i + "_IntX").val());
                DetallePago[posicion].Capital = parseFloat($("#" + i + "_Cap").val());
            }

        } 
        else if ($("#" + i + "_Fac").val() > 0) {

            var Montico = MontoDigitado * 1;
            $("#" + i + "_Cap").val(Montico.toFixed(2));
            $("#" + i + "_CapS").text(formatoDecimal(Montico.toFixed(2)));
            $("#" + i + "_IntX").val(InteresLinea.toFixed(2));
            $("#" + i + "_IntXS").text(formatoDecimal(InteresLinea.toFixed(2)));


            var posicion = DetallePago.indexOf(Fac);

            DetallePago[posicion].Total = parseFloat($("#" + i + "_Fac").val());
            DetallePago[posicion].Interes = parseFloat($("#" + i + "_IntX").val());
            DetallePago[posicion].Capital = parseFloat($("#" + i + "_Cap").val());
        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar generar ' + e

        })
    }
}
function calculaTotalPago() {
    try {

        var total = 0;
        for (var i = 0; i < DetallePago.length; i++) {
            total += DetallePago[i].Total;
        }

        $("#totP").text(formatoDecimal(total.toFixed(2)));

        var totalI = 0;
        for (var i = 0; i < DetallePago.length; i++) {
            totalI += DetallePago[i].Interes;
        }

        $("#totI").text(formatoDecimal(totalI.toFixed(2)));

        var totalC = 0;
        for (var i = 0; i < DetallePago.length; i++) {
            totalC += DetallePago[i].Capital;
        }

        $("#totC").text(formatoDecimal(totalC.toFixed(2)));
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
        $("#divProcesando").modal("show");
        var button = document.getElementById("botonG");
        var Recibido = {
            id: 0,
            idCliente: $("#ClienteSeleccionado").val(),
            CodSuc: "",
            Fecha: $("#Fecha").val(),
            FechaVencimiento: $("#fechaVencimiento").val(),
            FechaContabilizacion: $("#fechaContabilzacion").val(),
            Comentarios: $("#inputComentarios").val(),
            Referencia: "",
            Moneda: $("#selectMoneda").val(),
            TotalPagado: 0,
            TotalInteres: 0,
            TotalCapital: 0,
            Detalle: DetallePago
        }
        if (ValidarPago(Recibido)) {
            Swal.fire({
                title: '¿Desea guardar el pago?',
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
                    button.disabled = true;
                    $("#divProcesando").modal("show");


                    $.ajax({
                        type: 'POST',

                        url: $("#urlGenerar").val(),
                        dataType: 'json',
                        data: { recibidos: Recibido },
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.pago);
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

                                        ImprimirTiquete(json.pago);
                                    }
                                })

                            } else {
                                button.disabled = false;
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error al intentar guardar'

                                })
                            }
                        },

                        beforeSend: function () {

                        },
                        complete: function () {
                            $("#divProcesando").modal("hide");

                        },
                        error: function (error) {
                            $("#divProcesando").modal("hide");


                        }
                    });
                }
            })
        }

    } catch (e) {
        button.disabled = false;
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar generar ' + e

        })
    }
}

function ValidarPago(Pago) {
    try {
        if (Pago.idCliente == "0" || Pago.idCliente == null) {
            return false;
        } else if (Pago.Fecha == "" || Pago.Fecha == null) {
            return false;
        }
        else if (Pago.FechaVencimiento == "" || Pago.FechaVencimiento == null) {
            return false;
        } else if (Pago.FechaContabilizacion == "" || Pago.FechaContabilizacion == null) {
            return false;
        } else if (Pago.Detalle.length == 0 || Pago.Detalle == null) {
            return false;
        } else {
            return true;
        }
    } catch (e) {
        return false;
    }
}
function AbrirModalEdicion(id) {
    try {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: $("#urlModalEdicion").val(),
            data: { idB: id },
            success: function (result) {



                if (result != null) {
                    resultadoAnterior = result;
                    $("#idFacE").val(id);


                    var CondP = CP.find(a => a.id == result.idCondPago);


                    var Cliente = Clientes.find(a => a.id == result.idCliente);

                    var Vendedor = Vendedores.find(a => a.id == result.idVendedor);


                    $("#FechaM").text(result.fecha.toString().split("T")[0]);


                    $("#MonedaM").text(result.moneda);
                    $("#CondPagoM").text(CondP.Nombre);
                    $("#VendedorM").text(Vendedor.Nombre);
                    $("#ClaveHacienda").text(result.claveHacienda);
                    $("#ConsecutivoHaciendaM").text(result.consecutivoHacienda);

                    $("#DescuentoM").text(formatoDecimal(parseFloat(result.totalDescuento).toFixed(2)));
                    $("#ImpuestoM").text(formatoDecimal(parseFloat(result.totalImpuestos).toFixed(2)));
                    $("#TotalM").text(formatoDecimal(parseFloat(result.totalCompra).toFixed(2)));
                    $("#SubtotalM").text(formatoDecimal(parseFloat(result.subtotal).toFixed(2)));

                    $("#ClienteM").text(Cliente.Codigo + "-" + " " + Cliente.Nombre);





                    var htmlM = "";
                    $("#tbodyM").html(htmlM);


                    for (var i = 0; i < result.detalle.length; i++) {
                        htmlM += "<tr>";



                        htmlM += "<td > " + result.detalle[i].numLinea + " </td>";
                        var Producto = Productos.find(a => a.id == result.detalle[i].idProducto)
                        htmlM += "<td > " + Producto.Codigo + "-" + " " + Producto.Nombre + " </td>";

                        htmlM += "<td > " + result.detalle[i].cantidad + " </td>";
                        htmlM += "<td > " + formatoDecimal(parseFloat(result.detalle[i].precioUnitario).toFixed(2)) + " </td>";




                        htmlM += "<td > " + formatoDecimal(parseFloat(result.detalle[i].porDescto).toFixed(2)) + " </td>";
                        htmlM += "<td > " + formatoDecimal(parseFloat(result.detalle[i].descuento).toFixed(2)) + " </td>";
                        htmlM += "<td class='text-right'> " + formatoDecimal(parseFloat(result.detalle[i].totalImpuesto).toFixed(2)) + " </td>";
                        htmlM += "<td class='text-right'> " + formatoDecimal(parseFloat(result.detalle[i].totalLinea).toFixed(2)) + " </td>";


                        htmlM += "</tr>";


                    }

                    $("#tbodyM").html(htmlM);


                    AbrirModal();


                }

            },
            beforeSend: function () {

            },
            complete: function () {

            }
        });
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e

        })
    }

}

function onChangeRevisado(i) {
    try {


        var valorCheck = $("#" + i + "_mdcheckbox").prop('checked');
        var Saldo = ProdCadena[i].saldo;
        var fechaInicio = new Date(ProdCadena[i].fechaVencimiento).getTime();
        var fechaFin = new Date(Date.now()).getTime();
        var diff = fechaFin - fechaInicio;
        var diferencia = diff / (1000 * 60 * 60 * 24);
        var interes = 0;

        var valorCheckI = $("#" + i + "_mdcheckboxI").prop('checked');


        if (diferencia > 10) {
            interes = (Saldo * 0.0005) * (diferencia - 10);
        }

        var TotalF = Saldo + interes;

        if (valorCheck == true && valorCheckI == true) {
            $("#" + i + "_Fac").val(Saldo);
        } else if (valorCheck == true && valorCheckI == false) {
            $("#" + i + "_Fac").val(TotalF.toFixed(2));
        }
        else {
            $("#" + i + "_Fac").val(0);

        }

        onChangeMonto(i);


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }

}
function ImprimirTiquete(Pago) {
    try {



        var ventana = window.open('', 'PRINT', 'height=400,width=600');
        var texto = htmlAbono;
        texto = texto.replace("@Fecha", Pago.fecha.split("T")[0] + " " + Pago.fecha.split("T")[1].substring(0, 8));
        texto = texto.replace("@NumInterno", Pago.id);
        texto = texto.replace("CO-Pital", "");

        texto = texto.replace("@NumFactura", Pago.id);
        texto = texto.replace("@Comentario", Pago.comentarios);



        texto = texto.replace("@CodCliente", " " + Pago.idCliente);

        var Cli = Clientes.find(a => a.id == Pago.idCliente);
        texto = texto.replace("@NombreCliente", Cli.Nombre);



        var tabla = "";

        for (var i = 0; i < Pago.detalle.length; i++) {

            var DocuC = ProdCadena.find(a => a.id == Pago.detalle[i].idEncDocumentoCredito);

            tabla += "<tr>" + "<td colspan='3'>  " + DocuC.consecutivoHacienda + "  </td></tr>";


            tabla += "<tr>";

            tabla += "<td style='text-align left;'>" + formatoDecimal(Pago.detalle[i].interes) + " </td>";

            tabla += "<td style='text-align left;'>" + formatoDecimal(Pago.detalle[i].total) + " </td>";
            tabla += "<td style='text-align left;'>" + formatoDecimal(Pago.detalle[i].total) + " </td>";




            tabla += "</tr>";

        }
        texto = texto.replace("@Tabla", tabla);

        if (Pago.moneda == "CRC") {

            texto = texto.replace("@TotalIntereses", "₡" + formatoDecimal(Pago.totalInteres));
            texto = texto.replace("@Total", "₡" + formatoDecimal(Pago.totalPagado));
        } else {

            texto = texto.replace("@TotalIntereses", "$" + formatoDecimal(Pago.totalInteres));
            texto = texto.replace("@Total", "$" + formatoDecimal(Pago.totalPagado));
        }




        ventana.document.write(texto);
        ventana.document.close();
        ventana.focus();
        ventana.print();
        ventana.close();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }
}