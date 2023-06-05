
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



function Recuperar() {
    try {

        Deposito = JSON.parse($("#Deposito").val());
        CB = JSON.parse($("#CB").val());
     
        Cuentas = JSON.parse($("#Cuentas").val());


        RellenaCuenta();
        
  


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }
}

function RellenaCuenta() {
    try {
        var CuentaF = Deposito.CuentaFinal;

        var CuentasX = Cuentas.filter(a => a.Cuenta == CuentaF);
        for (var i = 0; i < CuentasX.length; i++) {
            Nombre = CuentasX[i].Nombre;
        }
        $("#Nombre").text(Nombre);

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }
}

function ImprimirPantalla() {
    try {
        // window.print();
        var margins = {
            top: 10,
            bottom: 10,
            left: 10,
            width: 595
        };


        html = $(".html").html();
        html2pdf(html, {
            margin: 1,
            padding: 0,
            filename: 'Depósito.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, logging: true },
            jsPDF: { unit: 'in', format: 'A2', orientation: 'P' },
            class: ImprimirPantalla
        });

    } catch (e) {
        console.log(e);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}
