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
                    result = result.filter(a => a.moneda == $("#selectMoneda").val());
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

           

            html += "<td > " + ProdCadena[i].docNum + " </td>";
            var CondP = CP.find(a => a.id == ProdCadena[i].idCondPago); 
            html += "<td > " + CondP.Nombre + " </td>";
        
            html += "<td > " + ProdCadena[i].fecha.toString().split("T")[0] + " </td>";
            html += "<td > " + ProdCadena[i].fechaVencimiento.toString().split("T")[0] + " </td>";
          

            var fechaInicio = new Date(ProdCadena[i].fechaVencimiento).getTime();
            var fechaFin = new Date(Date.now()).getTime();
            var diff = fechaFin - fechaInicio;
            var diferencia = diff / (1000 * 60 * 60 * 24);

            html += "<td > " + formatoDecimal(parseFloat(diferencia).toFixed(0)) + " </td>";
            html += "<td > " + ProdCadena[i].moneda + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].totalCompra).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].saldo).toFixed(2)) + " </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeCantidadProducto(" + i + ")' type='number' id='" + i + "_Prod' class='form-control'   value= '" + formatoDecimal(parseFloat(ProdCadena[i].totalDescuento).toFixed(2)) + "' min='1'/>  </td>";

            html += "<td class='text-center'> <a class='fa fa-info-circle icono' onclick='javascript:AbrirModal(" + ProdCadena[i].id + ") '> </a> </td>";

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
function AbrirModal() {
    try {
        $("#ModalInclusion").modal("show");
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e

        })
    }

}
 