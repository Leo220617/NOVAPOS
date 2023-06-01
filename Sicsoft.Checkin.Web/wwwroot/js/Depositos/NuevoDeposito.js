
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

function Recuperar() {
    try {

        Deposito = JSON.parse($("#Deposito").val());
        CB = JSON.parse($("#CB").val());
        USU = JSON.parse($("#USU").val());
        Cierres = JSON.parse($("#Cierres").val());
        Cuentas = JSON.parse($("#Cuentas").val());

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