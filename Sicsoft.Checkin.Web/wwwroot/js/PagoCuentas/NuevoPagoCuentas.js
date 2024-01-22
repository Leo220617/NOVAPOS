
$(document).ready(function () {
    jQuery(document).ready(function ($) {
        Recuperar();
    });



    $(document).ready(function () {


    });


});
var ProdCB = [];
var TipoCambio = [];
var MetodosPagosCuentas = [];
var Documento = [];
var CB = [];


onChangeMoneda();
var btn = document.getElementById('Guardar');

$(document).ready(function () {
    btn.disabled = false;
});

function Recuperar() {
    try {

        TipoCambio = JSON.parse($("#TipoCambio").val());

        CB = JSON.parse($("#CB").val());




    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }

}
function onGuardar() {
    try {
        btn.disabled = true;
        $("#formTipos").submit();
    } catch (e) {
        btn.disabled = true;

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error ' + e

        })
    }



}
function onChangeMoneda() {
    try {
        var html = "";
        var Moneda = $("#Moneda").val();



        var Cuentas = ProdCB.filter(a => a.Moneda == Moneda);
        $("#CuentaSeleccionada").html(html);
        html += "<option value='0' > Seleccione </option>";

        for (var i = 0; i < Cuentas.length; i++) {
            html += "<option value='" + Cuentas[i].id + "' > " + Cuentas[i].CuentaSAP + " - " + Cuentas[i].Nombre + " </option>";
        }

        $("#CuentaSeleccionada").html(html);
    } catch (e) {


        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error ' + e

        })
    }
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

function AbrirPago() {
    try {
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        $(".MetodosPagoRellenar").hide();
        var totalG = parseFloat($("#totG").val());

        if ($("#selectMoneda").val() != "CRC") {
            totalG = totalG * TipodeCambio.TipoCambio;
        }

        $("#TipCam").val(TipodeCambio.TipoCambio);


        if ($("#selectMoneda").val() == "CRC") {
            var Total = parseFloat($("#totG").val());
            $("#totPago").text(formatoDecimal(Total));
            $("#fatPago").text(formatoDecimal(Total));
            $("#selectMonedaP").val($("#selectMoneda").val());


            $("#totPagoD").text(formatoDecimal(Total / TipodeCambio.TipoCambio));
            $("#fatPagoD").text(formatoDecimal(Total / TipodeCambio.TipoCambio));


            onChangeMetodo();
            RellenaCB();


            $("#modalPagos").modal("show");
        } else {
            var Total = parseFloat($("#totG").val());
            $("#totPagoD").text(formatoDecimal(Total));
            $("#fatPagoD").text(formatoDecimal(Total));
            $("#selectMonedaP").val($("#selectMoneda").val());


            $("#totPago").text(formatoDecimal(Total * TipodeCambio.TipoCambio));
            $("#fatPago").text(formatoDecimal(Total * TipodeCambio.TipoCambio));


            onChangeMetodo();
            RellenaCB();
            $("#modalPagos").modal("show");
        }


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar abrir pagos ' + e

        })
    }
}

function RellenaCB() {
    try {
        var text = '';
        $("#CuentaB").html(text);
        var Moneda2 = $("#selectMonedaP").val();
        var Metodo = $("#MetodoSeleccionado").val();
        var Cuenta = CB.filter(a => a.Moneda == Moneda2 && a.Tipo == Metodo && a.Estado == true);

        for (var i = 0; i < Cuenta.length; i++) {

            text += "<option value= '" + Cuenta[i].id + "' > " + Cuenta[i].Nombre + " </option>";
        }

        $("#CuentaB").html(text);


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar abrir pagos ' + e

        })
    }
}
function onChangeMetodo() {
    try {
        var Metodo = $("#MetodoSeleccionado").val();
        var Moneda = $("#selectMonedaP").val();
        var MonedaDoc = $("#selectMoneda").val();
        // var Total = parseFloat(ReplaceLetra($("#totG").text())) - parseFloat(ReplaceLetra($("#pagPago").text()));
        var Total = 0;
        if ($("#MetodoSeleccionado").val() != '0') {
            $(".MetodosPagoRellenar").show();

        } else {
            $(".MetodosPagoRellenar").hide();

        }
        if (MonedaDoc == "CRC") {
            if (Moneda != MonedaDoc) {
                Total = parseFloat(ReplaceLetra($("#fatPagoD").text()));
            } else {
                Total = parseFloat(ReplaceLetra($("#fatPago").text()));
            }
        } else {
            if (Moneda != MonedaDoc) {
                Total = parseFloat(ReplaceLetra($("#fatPago").text()));
            } else {
                Total = parseFloat(ReplaceLetra($("#fatPagoD").text()));
            }
        }
        $("#MontoPago").val(Total);

        switch (Metodo) {
            case "Efectivo":
                {
                    $(".TARJETADIV").hide();
                    $(".OTRODIV").hide();
                    $(".CHEQUEDIV").hide();
                    $(".EFECTIVODIV").show();
                    $(".TRANSFERENCIADIV").hide();
                    $(".CUENTADIV").show();

                    if (Moneda != MonedaDoc) {

                        $("#PagadoCon").val(Total);
                    }

                    RellenaCB();
                    break;
                }
            case "Tarjeta":
                {
                    $(".OTRODIV").hide();
                    $(".EFECTIVODIV").hide();

                    $(".TARJETADIV").show();
                    $(".TRANSFERENCIADIV").show();
                    $(".CHEQUEDIV").hide();
                    $(".CUENTADIV").show();
                    RellenaCB();
                    break;
                }
            case "Transferencia":
                {
                    $(".OTRODIV").hide();
                    $(".EFECTIVODIV").hide();

                    $(".TARJETADIV").hide();
                    $(".CHEQUEDIV").hide();
                    $(".TRANSFERENCIADIV").show();
                    $(".CUENTADIV").show();
                    RellenaCB();
                    break;
                }
            case "Cheque":
                {
                    $(".OTRODIV").hide();
                    $(".EFECTIVODIV").hide();

                    $(".TARJETADIV").hide();
                    $(".CHEQUEDIV").show();
                    $(".TRANSFERENCIADIV").hide();
                    $(".CUENTADIV").hide();
                    RellenaCB();
                    break;
                }
            case "Otros":
                {
                    $(".EFECTIVODIV").hide();

                    $(".TARJETADIV").hide();
                    $(".CHEQUEDIV").hide();
                    $(".OTRODIV").show();
                    $(".TRANSFERENCIADIV").hide();
                    $(".CUENTADIV").show();
                    RellenaCB();
                    break;
                }

            case "Pago a Cuenta":
                {
                    $(".OTRODIV").hide();
                    $(".EFECTIVODIV").hide();

                    $(".TARJETADIV").hide();
                    $(".CHEQUEDIV").hide();
                    $(".TRANSFERENCIADIV").show();
                    $(".CUENTADIV").show();
                    RellenaCB();
                    break;
                }
            default:
                {
                    $(".EFECTIVODIV").hide();

                    $(".TARJETADIV").hide();
                    $(".OTRODIV").hide();
                    $(".CHEQUEDIV").hide();
                    RellenaCB();
                    break;
                }

        }


        onChangeMonedaP();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }
}
function insertarPago() {
    try {
        var Moneda = $("#selectMonedaP").val();
        var MonedaDoc = $("#selectMoneda").val();
        var Metodo = $("#MetodoSeleccionado").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        if (validarMetodo()) {
            switch (Metodo) {
                case "Efectivo":
                    {


                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            idCuentaBancaria: $("#CuentaB").val(),
                            Monto: parseFloat(ReplaceLetra($("#MontoPago").val())),
                            // Monto: Moneda == MonedaDoc ? parseFloat(ReplaceLetra($("#MontoPago").val())) : Moneda != "CRC" ? parseFloat(ReplaceLetra($("#MontoPago").val())) / TipodeCambio.TipoCambio : parseFloat(ReplaceLetra($("#MontoPago").val())) * TipodeCambio.TipoCambio,
                            BIN: "",
                            NumReferencia: "",
                            NumCheque: "",
                            Metodo: "Efectivo",
                            Moneda: $("#selectMonedaP").val(),
                            MonedaVuelto: $("#selectMonedaV").val(),
                            PagadoCon: parseFloat(ReplaceLetra($("#PagadoCon").val()))
                        };
                        MetodosPagosCuentas.push(Detalle);

                        break;
                    }
                case "Tarjeta":
                    {
                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            idCuentaBancaria: $("#CuentaB").val(),
                            Monto: parseFloat(ReplaceLetra($("#MontoPago").val())),

                            //Monto: MonedaDoc != "CRC" ? (Moneda != MonedaDoc ? parseFloat(ReplaceLetra($("#MontoPago").val())) / TipodeCambio.TipoCambio : parseFloat(ReplaceLetra($("#MontoPago").val())) * TipodeCambio.TipoCambio) : (Moneda != MonedaDoc ? parseFloat(ReplaceLetra($("#MontoPago").val())) * TipodeCambio.TipoCambio : parseFloat(ReplaceLetra($("#MontoPago").val())) / TipodeCambio.TipoCambio),

                            BIN: $("#BINPago").val(),
                            NumReferencia: $("#ReferenciaPago").val(),
                            NumCheque: "",
                            Metodo: "Tarjeta",
                            Moneda: $("#selectMonedaP").val(),
                            MonedaVuelto: "",
                            PagadoCon: 0
                        };
                        MetodosPagosCuentas.push(Detalle);

                        break;
                    }
                case "Transferencia":
                    {
                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            idCuentaBancaria: $("#CuentaB").val(),
                            Monto: parseFloat(ReplaceLetra($("#MontoPago").val())),
                            BIN: "",
                            NumReferencia: $("#ReferenciaPago").val(),
                            NumCheque: "",
                            Metodo: "Transferencia",
                            Moneda: $("#selectMonedaP").val(),
                            MonedaVuelto: "",
                            PagadoCon: 0
                        };
                        MetodosPagosCuentas.push(Detalle);

                        break;
                    }
                case "Cheque":
                    {
                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            idCuentaBancaria: $("#CuentaB").val(),
                            Monto: parseFloat(ReplaceLetra($("#MontoPago").val())),

                            BIN: "",
                            NumReferencia: "",
                            NumCheque: $("#ChequePago").val(),
                            Metodo: "Cheque",
                            Moneda: $("#selectMonedaP").val(),
                            MonedaVuelto: "",
                            PagadoCon: 0
                        };
                        MetodosPagosCuentas.push(Detalle);
                        break;
                    }
                case "Otros":
                    {
                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            idCuentaBancaria: $("#CuentaB").val(),
                            Monto: parseFloat(ReplaceLetra($("#MontoPago").val())),

                            BIN: "",
                            NumReferencia: "",
                            NumCheque: "",
                            Metodo: "Otros | " + $("#otroPago").val(),
                            Moneda: $("#selectMonedaP").val(),
                            MonedaVuelto: "",
                            PagadoCon: 0
                        };
                        MetodosPagosCuentas.push(Detalle);

                        break;
                    }
                case "Pago a Cuenta":
                    {
                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            idCuentaBancaria: $("#CuentaB").val(),
                            Monto: parseFloat(ReplaceLetra($("#MontoPago").val())),

                            BIN: "",
                            NumReferencia: "",
                            NumCheque: $("#ReferenciaPago").val(),
                            Metodo: "Pago a Cuenta",
                            Moneda: $("#selectMonedaP").val(),
                            MonedaVuelto: "",
                            PagadoCon: 0
                        };
                        MetodosPagosCuentas.push(Detalle);

                        break;
                    }
                default:
                    {

                        break;
                    }
            }


            $("#MetodoSeleccionado").val("0");
            calcularPago();
            onChangeMetodo();
            RellenaTablaPagos();
            LimpiarDatosPago();
            RellenaCB();
            $("#selectMonedaP").val($("#selectMoneda").val());
        } else {

        }


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }
}
function LimpiarDatosPago() {
    try {
        $("#PagadoCon").val(0);
        $("#otroPago").val("");
        $("#ChequePago").val("");
        $("#BINPago").val("");
        $("#ReferenciaPago").val("");

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }
}
function validarMetodo() { // CAMBIAR
    try {
        var Metodo = $("#MetodoSeleccionado").val();

        var Moneda = $("#selectMonedaP").val();
        var Monto = parseFloat($("#MontoPago").val());
        var MonedaDoc = $("#selectMoneda").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        var Total = MonedaDoc == "CRC" ? parseFloat(ReplaceLetra($("#totG").text())) - parseFloat(ReplaceLetra($("#pagPago").text())) : 0; //Total En Colones
        var TotalD = MonedaDoc != "CRC" ? parseFloat(ReplaceLetra($("#totG").text())) - parseFloat(ReplaceLetra($("#pagPagoD").text())) : 0;

        if (Total <= 0 && TotalD <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se puede ingresar montos mayores a lo pagado'

            })
            return false;
        }

        if (parseFloat($("#MontoPago").val()) > parseFloat(ReplaceLetra($("#fatPago").text())) && MonedaDoc == Moneda && MonedaDoc == "CRC") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se puede ingresar montos mayores a lo faltante'

            })
            return false;
        }

        if (parseFloat($("#MontoPago").val()) > parseFloat(ReplaceLetra($("#fatPagoD").text())) && MonedaDoc == Moneda && MonedaDoc != "CRC") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se puede ingresar montos mayores a lo faltante'

            })
            return false;
        }
        //if ((parseFloat($("#MontoPago").val()) * TipodeCambio.TipoCambio) > parseFloat(ReplaceLetra($("#fatPago").text())) && Moneda == "USD" && MonedaDoc == "CRC") {
        //    Swal.fire({
        //        icon: 'error',
        //        title: 'Oops...',
        //        text: 'No se puede ingresar montos mayores a lo faltante'

        //    })
        //    return false;
        //}

        //if ((parseFloat($("#MontoPago").val()) / TipoCambio.TipoCambio) > parseFloat(ReplaceLetra($("#fatPago").text())) && Moneda == "CRC" && MonedaDoc == "USD") {
        //    Swal.fire({
        //        icon: 'error',
        //        title: 'Oops...',
        //        text: 'No se puede ingresar montos mayores a lo faltante'

        //    })
        //    return false;
        //}

        if ($("#CuentaB").val() == "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Falta la cuenta bancaria'

            })
            return false;
        }
        switch (Metodo) {
            case "Efectivo":
                {
                    if (parseFloat(ReplaceLetra($("#MontoPago").val())) <= 0 || $("#PagadoCon").val() == undefined || $("#PagadoCon").val() == 0 || $("#PagadoCon").val() < parseFloat(ReplaceLetra($("#MontoPago").val()))) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Parece que faltan datos por rellenar '

                        })
                        return false;
                    } else {
                        return true;
                    }


                    break;
                }
            case "Tarjeta":
                {
                    if (parseFloat(ReplaceLetra($("#MontoPago").val())) <= 0 || $("#BINPago").val() == undefined || $("#BINPago").val() == "") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Parece que faltan datos por rellenar '

                        })
                        return false;
                    } else if (parseFloat(ReplaceLetra($("#ReferenciaPago").val())) <= 0 || $("#ReferenciaPago").val() == undefined || $("#ReferenciaPago").val() == "") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Parece que faltan datos por rellenar '

                        })
                        return false;
                    }
                    else {
                        return true;
                    }

                    break;
                }
            case "Transferencia":
                {
                    if (parseFloat(ReplaceLetra($("#ReferenciaPago").val())) <= 0 || $("#ReferenciaPago").val() == undefined || $("#ReferenciaPago").val() == "") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Parece que faltan datos por rellenar '

                        })
                        return false;
                    }
                    else {
                        return true;
                    }

                    break;
                }
            case "Cheque":
                {
                    if (parseFloat(ReplaceLetra($("#MontoPago").val())) <= 0 || $("#ChequePago").val() == undefined || $("#ChequePago").val() == "") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Parece que faltan datos por rellenar '

                        })
                        return false;
                    }
                    else {
                        return true;
                    }
                    break;
                }
            case "Otros":
                {
                    if (parseFloat(ReplaceLetra($("#MontoPago").val())) <= 0 || $("#otroPago").val() == undefined || $("#otroPago").val() == "") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Parece que faltan datos por rellenar '

                        })
                        return false;
                    }
                    else {
                        return true;
                    }

                    break;
                }
            default:
                {
                    return true;
                    break;
                }
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }
}

function RellenaTablaPagos() {
    try {
        var text = "";
        $("#tbodyPago").html(text);

        for (var i = 0; i < MetodosPagosCuentas.length; i++) {
            text += "<tr>";
            text += "<td class='text-center'> " + MetodosPagosCuentas[i].Metodo + " </td>";
            text += "<td class='text-center'> " + MetodosPagosCuentas[i].BIN + " </td>";
            text += "<td class='text-center'> " + MetodosPagosCuentas[i].NumReferencia + " </td>";
            /*  text += "<td class='text-center'> " + MetodosPagosCuentas[i].NumCheque + " </td>";*/
            text += "<td class='text-center'> " + MetodosPagosCuentas[i].Moneda + " </td>";
            text += "<td class='text-rigth'> " + formatoDecimal(MetodosPagosCuentas[i].Monto) + " </td>";
            text += "<td class='text-center'> <a class='fa fa-trash' onclick='javascript:EliminarPago(" + i + ") '> </a> </td>";
            text += "</tr>";

        }

        $("#tbodyPago").html(text);


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }
}


function calcularPago() { //REVISAR
    try {

        var Faltante = 0;
        var FaltanteD = 0;
        var PagadoT = 0;
        var PagadoTD = 0;
        var Pagado = 0;
        var PagadoD = 0;
        var MonedaDoc = $("#selectMoneda").val();

        var Total = 0;// parseFloat(ReplaceLetra($("#totG").text()));
        var TotalD = 0;
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var vueltoT = 0;
        var vueltoTD = 0;
        var vuelto = 0;
        var vueltoD = 0;
        $("#vueltoPago").text(formatoDecimal(vuelto.toFixed(2)));
        $("#vueltoPagoD").text(formatoDecimal(vueltoD.toFixed(2)));


        if (MonedaDoc != "CRC") {
            TotalD = parseFloat($("#totG").val());
            Total = TotalD * TipodeCambio.TipoCambio;
        } else {
            Total = parseFloat($("#totG").val());
            TotalD = Total / TipodeCambio.TipoCambio;
        }

        for (var i = 0; i < MetodosPagosCuentas.length; i++) {

            // if (MetodosPagosCuentas[i].Moneda == MonedaDoc) {
            if (MetodosPagosCuentas[i].Moneda != "CRC") { // Moneda del Pago viene en USD

                PagadoTD += MetodosPagosCuentas[i].Monto;
                PagadoT += MetodosPagosCuentas[i].Monto * TipodeCambio.TipoCambio;

                PagadoD += MetodosPagosCuentas[i].Monto;
                //   Pagado += MetodosPagosCuentas[i].Monto * TipodeCambio.TipoCambio;
                if (MetodosPagosCuentas[i].Metodo == "Efectivo") {

                    if (MetodosPagosCuentas[i].PagadoCon > 0) {

                        if (MetodosPagosCuentas[i].Moneda != MonedaDoc) { // SI USD = Moneda DOC
                            vueltoTD += (MetodosPagosCuentas[i].PagadoCon) - MetodosPagosCuentas[i].Monto;
                            vueltoT += ((MetodosPagosCuentas[i].PagadoCon) - MetodosPagosCuentas[i].Monto) * TipodeCambio.TipoCambio;

                            vueltoD += (MetodosPagosCuentas[i].PagadoCon) - MetodosPagosCuentas[i].Monto;
                        } else {
                            vueltoTD += MetodosPagosCuentas[i].PagadoCon - MetodosPagosCuentas[i].Monto;
                            vueltoT += (MetodosPagosCuentas[i].PagadoCon - MetodosPagosCuentas[i].Monto) * TipodeCambio.TipoCambio;

                            vueltoD += MetodosPagosCuentas[i].PagadoCon - MetodosPagosCuentas[i].Monto;
                        }

                        // vuelto += (MetodosPagosCuentas[i].PagadoCon - MetodosPagosCuentas[i].Monto) * TipodeCambio.TipoCambio;
                    }
                }

            } else {

                PagadoT += MetodosPagosCuentas[i].Monto;
                PagadoTD += MetodosPagosCuentas[i].Monto / TipodeCambio.TipoCambio;
                Pagado += MetodosPagosCuentas[i].Monto;
                // PagadoD += MetodosPagosCuentas[i].Monto / TipodeCambio.TipoCambio;

                if (MetodosPagosCuentas[i].Metodo == "Efectivo") {

                    if (MetodosPagosCuentas[i].PagadoCon > 0) {
                        if (MetodosPagosCuentas[i].Moneda != MonedaDoc) {
                            vueltoT += (MetodosPagosCuentas[i].PagadoCon) - MetodosPagosCuentas[i].Monto;
                            vueltoTD += ((MetodosPagosCuentas[i].PagadoCon) - MetodosPagosCuentas[i].Monto) / TipodeCambio.TipoCambio;

                            vuelto += (MetodosPagosCuentas[i].PagadoCon) - MetodosPagosCuentas[i].Monto;

                        } else {
                            vueltoT += MetodosPagosCuentas[i].PagadoCon - MetodosPagosCuentas[i].Monto;
                            vueltoTD += (MetodosPagosCuentas[i].PagadoCon - MetodosPagosCuentas[i].Monto) / TipodeCambio.TipoCambio;

                            vuelto += MetodosPagosCuentas[i].PagadoCon - MetodosPagosCuentas[i].Monto;
                        }

                        // vueltoD += (MetodosPagosCuentas[i].PagadoCon - MetodosPagosCuentas[i].Monto) / TipodeCambio.TipoCambio;
                    }
                }
            }


        }


        Faltante = Total - PagadoT;
        FaltanteD = TotalD - PagadoTD;

        $("#fatPago").text(formatoDecimal(Faltante));
        $("#pagPago").text(formatoDecimal(Pagado));
        $("#vueltoPago").text(formatoDecimal(vuelto));
        $("#vueltoPagoG").text(formatoDecimal(vueltoT));


        $("#fatPagoD").text(formatoDecimal(FaltanteD));
        $("#pagPagoD").text(formatoDecimal(PagadoD));
        $("#vueltoPagoD").text(formatoDecimal(vueltoD));
        $("#vueltoPagoGD").text(formatoDecimal(vueltoTD));



    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }
}

function EliminarPago(i) {
    try {

        MetodosPagosCuentas.splice(i, 1);
        calcularPago();
        RellenaTablaPagos();

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }
}
function onChangeMonedaP() {
    try {

        RellenaCB();
        var Moneda = $("#selectMonedaP").val(); //Moneda del pago
        var Monto = parseFloat($("#MontoPago").val()); //Monto que se pone el input
        var MonedaDoc = $("#selectMoneda").val(); //Moneda del documento
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var Total = parseFloat(ReplaceLetra($("#totG").text()));
        var Metodo = $("#MetodoSeleccionado").val();




        if (Metodo == "Efectivo") {

            $("#PagadoCon").val(Monto);
        }


        if (Moneda != "CRC") { //Si es USD
            if (Moneda != MonedaDoc) {
                var TotalC = Monto * TipodeCambio.TipoCambio;
                $("#TotalC").val(TotalC); // lo pongo en colones
                //var TotalD = Monto / TipodeCambio.TipoCambio; // Tptal en dolares
                $("#TotalD").val(Monto);
            } else {
                var TotalC = Monto * TipodeCambio.TipoCambio; // Tptal en dolares
                $("#TotalC").val(TotalC); // lo pongo en colones

                $("#TotalD").val(Monto);
            }


        } else { //La moneda que se escogio es colones

            if (Moneda != MonedaDoc) {
                $("#TotalC").val(Monto); // lo pongo en colones
                var TotalD = Monto / TipodeCambio.TipoCambio; // Tptal en dolares
                $("#TotalD").val(TotalD);

            } else {
                $("#TotalC").val(Monto); // lo pongo en colones
                var TotalD = Monto / TipodeCambio.TipoCambio; // Tptal en dolares
                $("#TotalD").val(TotalD);
            }

        }




    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}


function Generar() {

    try {


        var PagoCuenta = {
            id: 0,
            idCliente: $("#ClienteSeleccionado").val(),
            idCuentaBancaria: 0,
            idUsuarioCreador: 0,
            idCaja: 0,
         
            
            Fecha: $("#Fecha").val(),

            FechaContabilizacion: $("#FechaConta").val(),
            FechaVencimiento: $("#FechaVencimiento").val(),
            Comentarios: $("#inputComentarios").val(),
            Total: parseFloat($("#totG").val()),
            CodSuc: "",
            Moneda: $("#selectMoneda").val(),
            MetodosPagosCuentas: MetodosPagosCuentas
        }

        if (validarPagoCuenta(PagoCuenta)) {
            Swal.fire({
                title: '¿Desea guardar el pago a cuenta?',
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
                        data: { recibidos: PagoCuenta },
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.pagoCuenta);
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
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.oferta

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

function validarPagoCuenta(e) {
    try {
      


      
            if (e.idCliente == "0" || e.idCliente == null) {
                return false;
            } else if (e.FechaVencimiento == "" || e.FechaVencimiento == null) {
                return false;

            } else if (e.Fecha == "" || e.Fecha == null) {
                return false;

            } else if (e.FechaContabilizacion == "" || e.FechaContabilizacion == null) {
                return false;
            }
            else if (e.MetodosPagosCuentas.length == 0 || e.MetodosPagosCuentas == null) {
                return false;
            }
            else if (e.Total <= 0 || e.Total == null || e.Total == "") {
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