
$(document).ready(function () {
    jQuery(document).ready(function ($) {
        Recuperar();
    });



    $(document).ready(function () {

    });


});
var Cuentas = []; // variables globales
var Cierres = [];
var Deposito = [];
var USU = [];
var CB = [];
var Lista = [];
var SaldoAnterior = 0;

function Recuperar() {
    try {

        Deposito = JSON.parse($("#Deposito").val());
        CB = JSON.parse($("#CB").val());
        USU = JSON.parse($("#USU").val());
        Cierres = JSON.parse($("#Cierres").val());
        Cuentas = JSON.parse($("#Cuentas").val());
        Lista = JSON.parse($("#Lista").val());

        

        onChangeMoneda();


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }

}
function onChangeMoneda() {
    try {

        RellenaCuentaDestino();
        RellenaMisCuentas();
        SaldoDisponible();





    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}

function RellenaCuentaDestino() {
    try {
        var html = "";
        var Moneda = $("#selectMoneda").val();
        var CuentasF = Cuentas.filter(a => a.Moneda == Moneda);
        $("#CuentaSeleccionada").html(html);
        html += "<option value='0' > Seleccione Cuenta Bancaria </option>";

        for (var i = 0; i < CuentasF.length; i++) {
            html += "<option value='" + CuentasF[i].Cuenta + "' > " + CuentasF[i].Cuenta + " - " + CuentasF[i].Nombre + " </option>";
        }



        $("#CuentaSeleccionada").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function RellenaMisCuentas() {
    try {
        var html = "";
        var Moneda = $("#selectMoneda").val();
        var CBF = CB.filter(a => a.Moneda == Moneda && a.Tipo == "Efectivo");
        $("#MisCuentas").html(html);
        html += "<option value='0' > Seleccione Cuenta Bancaria </option>";

        for (var i = 0; i < CBF.length; i++) {
            html += "<option value='" + CBF[i].CuentaSAP + "' > " + CBF[i].CuentaSAP + " - " + CBF[i].Nombre + " </option>";
        }



        $("#MisCuentas").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function SaldoDisponible() {
    try {
        var Moneda = $("#selectMoneda").val();
        var ListaX = Lista.filter(a => a.Moneda == Moneda);
         SaldoAnterior = 0;
        var Totalizado = 0;

        for (var i = 0; i < ListaX.length; i++) {
            SaldoAnterior += ListaX[i].Saldo;
        }
        if (Moneda != "CRC") {
            Totalizado = Cierres.TotalVendidoFC - SaldoAnterior;
        } else {
            Totalizado = Cierres.TotalVendidoColones - SaldoAnterior;
        }
       

        $("#SaldoDisponible").val(Totalizado.toFixed(2));


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }
}

//Generar

function Generar() {

    try {

       
        var Deposito = {
            id: 0,
            idUsuarioCreador: 0,
            idCaja: 0,
            CodSuc: "",
            idVendedor: $("#selectVendedor").val(),
            Fecha: $("#Fecha").val(),
            Banco: $("#Banco").val(),
            Referencia: $("#Referencia").val(),
            CuentaInicial: $("#MisCuentas").val(),
            CuentaFinal: $("#CuentaSeleccionada").val(),
            Saldo: $("#Monto").val(),
            Moneda: $("#selectMoneda").val(),
            Comentarios: $("#inputComentarios").val(),
            SaldoDisponibleAnterior: $("#SaldoAnterior").val(),



        }

        if (validarDeposito(Deposito)) {
            Swal.fire({
                title: '¿Desea guardar el depósito?',
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
                        data: { recibidos: Deposito },
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.Oferta);
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
                                    text: 'Ha ocurrido un error al intentar guardar'

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

function validarDeposito(e) {
    try {
        var Moneda = $("#selectMoneda").val();
      

        if (Moneda != "CRC") {
            if (e.Saldo > ((Cierres.TotalVendidoFC + Cierres.TotalAperturaFC) - SaldoAnterior) ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error al intentar agregar, el monto es mayor al registrado en el Cierre'

                })
                return false;
            }
        }
        else {
            if (e.Saldo > ((Cierres.TotalVendidoColones + Cierres.TotalAperturaColones) - SaldoAnterior)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error al intentar agregar, el monto es mayor al registrado en el Cierre'

                })
                return false;
            }
        }

        if (e.CuentaInicial == "0" || e.CuentaInicial == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Cuenta Inicial'

            })
            return false;
        }
        if (e.CuentaFinal == "0" || e.CuentaFinal == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Cuenta Final'

            })
            return false;
        }
        if (e.Fecha == "" || e.Fecha == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Fecha'

            })
            return false;
        }

        if (e.Banco == "" || e.Banco == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta el Banco '

            })
            return false;
        }
        if (e.Saldo <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, el monto tiene que ser mayor a 0 '

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