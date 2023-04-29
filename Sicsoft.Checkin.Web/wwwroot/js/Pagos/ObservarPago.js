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
var Facturas = [];

function Recuperar() {
    try {


        Clientes = JSON.parse($("#Clientes").val());
        Vendedores = JSON.parse($("#Vendedores").val());
        Productos = JSON.parse($("#Productos").val());
        Facturas = JSON.parse($("#Facturas").val());


        TipoCambio = JSON.parse($("#TipoCambio").val());
        Documento = JSON.parse($("#Documento").val());
        CP = JSON.parse($("#CP").val());




    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

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


function AbrirModalEdicion(id) {
    try {

        var result = Facturas.find(a => a.id == id);

        var CondP = CP.find(a => a.id == result.idCondPago);


        var Cliente = Clientes.find(a => a.id == result.idCliente);

        var Vendedor = Vendedores.find(a => a.id == result.idVendedor);


        $("#FechaM").text(result.Fecha.toString().split("T")[0]);


        $("#MonedaM").text(result.Moneda);
        $("#CondPagoM").text(CondP.Nombre);
        $("#VendedorM").text(Vendedor.Nombre);
        $("#ClaveHacienda").text(result.ClaveHacienda);
        $("#ConsecutivoHaciendaM").text(result.ConsecutivoHacienda);

        $("#DescuentoM").text(formatoDecimal(parseFloat(result.TotalDescuento).toFixed(2)));
        $("#ImpuestoM").text(formatoDecimal(parseFloat(result.TotalImpuestos).toFixed(2)));
        $("#TotalM").text(formatoDecimal(parseFloat(result.TotalCompra).toFixed(2)));
        $("#SubtotalM").text(formatoDecimal(parseFloat(result.Subtotal).toFixed(2)));

        $("#ClienteM").text(Cliente.Codigo + "-" + " " + Cliente.Nombre);





        var htmlM = "";
        $("#tbodyM").html(htmlM);


        for (var i = 0; i < result.Detalle.length; i++) {
            htmlM += "<tr>";



            htmlM += "<td > " + result.Detalle[i].NumLinea + " </td>";
            var Producto = Productos.find(a => a.id == result.Detalle[i].idProducto)
            htmlM += "<td > " + Producto.Codigo + "-" + " " + Producto.Nombre + " </td>";

            htmlM += "<td > " + result.Detalle[i].Cantidad + " </td>";
            htmlM += "<td > " + formatoDecimal(parseFloat(result.Detalle[i].PrecioUnitario).toFixed(2)) + " </td>";




            htmlM += "<td > " + formatoDecimal(parseFloat(result.Detalle[i].PorDescto).toFixed(2)) + " </td>";
            htmlM += "<td > " + formatoDecimal(parseFloat(result.Detalle[i].Descuento).toFixed(2)) + " </td>";
            htmlM += "<td class='text-right'> " + formatoDecimal(parseFloat(result.Detalle[i].TotalImpuesto).toFixed(2)) + " </td>";
            htmlM += "<td class='text-right'> " + formatoDecimal(parseFloat(result.Detalle[i].TotalLinea).toFixed(2)) + " </td>";


            htmlM += "</tr>";


        }

        $("#tbodyM").html(htmlM);


        AbrirModal();




    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e

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
            filename: 'Abono.pdf',
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