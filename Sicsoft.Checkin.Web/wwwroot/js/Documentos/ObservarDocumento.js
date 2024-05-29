$(document).ready(function () {
    jQuery(document).ready(function ($) {

    });



    $(document).ready(function () {
        Recuperar();
    });


});
var Documento = [];
var CP = [];
var Clientes = [];
var Vendedor = [];
var Productos = [];
var Bodegas = [];
var TipoCambio = [];
var ids = '';
var idDetalles = 0;
var LotesCadena = [];
var EstadosLotes = [];


function Recuperar() {
    try {
        Documento = JSON.parse($("#Documento").val());
        CP = JSON.parse($("#CP").val());
        Clientes = JSON.parse($("#Clientes").val());
        Vendedor = JSON.parse($("#Vendedor").val());
        Productos = JSON.parse($("#Productos").val());
        TipoCambio = JSON.parse($("#TipoCambio").val());
        Bodegas = JSON.parse($("#Bodegas").val());
        var lot = JSON.parse($("#Lotes").val());




        for (var i = 0; i < lot.length; i++) {
            var lote = {
                id: i,
                idEncabezado: 0,
                Serie: lot[i].Serie,
                ItemCode: lot[i].ItemCode,
                Cantidad: lot[i].Cantidad,
                idDetalle: 0


            }
            LotesCadena.push(lote);
        }



    } catch (e) {
        console.log(e);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}

function onClickModal(id, idDetalle) {
    ids = id;
    idDetalles = idDetalle;
    var LotesArray = LotesCadena.filter(a => a.ItemCode == ids);
    $("#spanProd").text(ids);
    var sOptions = '';

    $("#tbody").html('');
    for (var i = 0; i < LotesArray.length; i++) {
        sOptions += '<tr>';
        sOptions += '<td >' + i + '</td>';
        sOptions += '<td class="text-center">' + LotesArray[i].Serie + '</td>';


        sOptions += '<td class="text-center">' + LotesArray[i].Cantidad + '</td>';




        sOptions += '</tr>'

    }
    $("#tbody").html(sOptions);

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
        //html2pdf(html, {
        //    margin: 1,
        //    padding: 0,
        //    filename: 'Documento.pdf',
        //    image: { type: 'jpeg', quality: 1 },
        //    html2canvas: { scale: 2, logging: true },
        //    jsPDF: { unit: 'in', format: 'A2', orientation: 'P' },
        //    class: ImprimirPantalla
        //});
        var Contado = CP.find(a => a.Nombre == "Contado");

        if (Documento.idCondPago == Contado.id) {
            ImprimirTiquete();
            //if (Documento.TipoDocumento == "03") {
            //    ImprimirTiqueteNC();
            //} else {
            //    ImprimirTiquete();
            //}
            

        } else {
            ImprimirTiqueteC();

        }
    } catch (e) {
        console.log(e);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}
function ImprimirTiquete() {
    try {



        var ventana = window.open('', 'PRINT', 'height=400,width=600');
        var texto = htmlContado;
        texto = texto.replace("@Fecha", Documento.Fecha.split("T")[0]);
        texto = texto.replace("@NumInterno", Documento.id);
        texto = texto.replace("@CodSuc", Documento.CodSuc);
        texto = texto.replace("@NumComprobante", Documento.ConsecutivoHacienda);
        texto = texto.replace("@NumFactura", Documento.id);



        if (Documento.tipoDocumento == "04") {
            texto = texto.replace("FACTURA", "TIQUETE");

        }
        var Cli = Clientes.find(a => a.id == Documento.idCliente);
        texto = texto.replace("@CodCliente", " " + Cli.Codigo);

        
        texto = texto.replace("@NombreCliente", Cli.Nombre);
        texto = texto.replace("@Vendedor", Vendedor.Nombre);
        texto = texto.replace("@Comentario", Documento.Comentarios);


        var tabla = "";

        for (var i = 0; i < Documento.Detalle.length; i++) {

            var Prod = Productos.find(a => a.id == Documento.Detalle[i].idProducto);
            var Bod = Bodegas.find(a => a.id == Prod.idBodega);

            tabla += "<tr>" + "<td colspan='3'>  " + Prod.Codigo + "-" + Prod.Nombre + " - BOD:" + Bod.CodSAP + "  </td></tr>";


            tabla += "<tr>";
           
            tabla += "<td style='text-align left;'>" + Documento.Detalle[i].Cantidad + " </td>";
            
            tabla += "<td style='text-align left;'>" + formatoDecimal(Documento.Detalle[i].PrecioUnitario) + " </td>";
            tabla += "<td style='text-align left;'>" + formatoDecimal(Documento.Detalle[i].TotalLinea) + " </td>";
            //tabla += "<p style=' text-align left; color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>" + Prod.Codigo + "-" + Prod.Nombre + " </p>";



            tabla += "</tr>";

        }
        texto = texto.replace("@Tabla", tabla);

        if (Documento.Moneda == "CRC") {
            texto = texto.replace("@SubTotal", "₡" + formatoDecimal(Documento.Subtotal));
            texto = texto.replace("@TotalDescuento", "₡" + formatoDecimal(Documento.TotalDescuento));
            texto = texto.replace("@TotalImpuestos", "₡" + formatoDecimal(Documento.TotalImpuestos));
            texto = texto.replace("@Redondeo", "₡" + formatoDecimal(Documento.Redondeo));
            texto = texto.replace("@Total", "₡" + formatoDecimal(Documento.TotalCompra + Documento.Redondeo));

        } else {
            texto = texto.replace("@SubTotal", "$" + formatoDecimal(Documento.Subtotal));
            texto = texto.replace("@TotalDescuento", "$" + formatoDecimal(Documento.TotalDescuento));
            texto = texto.replace("@TotalImpuestos", "$" + formatoDecimal(Documento.TotalImpuestos));
            texto = texto.replace("@Redondeo", "$" + formatoDecimal(Documento.Redondeo));
            texto = texto.replace("@Total", "$" + formatoDecimal(Documento.TotalCompra + Documento.Redondeo));
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

function ImprimirTiqueteNC() {
    try {



        var ventana = window.open('', 'PRINT', 'height=400,width=600');
        var texto = htmlContadoNC;
        texto = texto.replace("@Fecha", Documento.Fecha.split("T")[0]);
        texto = texto.replace("@NumInterno", Documento.id);
        texto = texto.replace("@CodSuc", Documento.CodSuc);
        texto = texto.replace("@NumComprobante", Documento.ConsecutivoHacienda);
        texto = texto.replace("@NumFactura", Documento.id);



        if (Documento.tipoDocumento == "04") {
            texto = texto.replace("FACTURA", "TIQUETE");

        }
        var Cli = Clientes.find(a => a.id == Documento.idCliente);
        texto = texto.replace("@CodCliente", " " + Cli.Codigo);

    
        texto = texto.replace("@NombreCliente", Cli.Nombre);
        texto = texto.replace("@Vendedor", Vendedor.Nombre);
        texto = texto.replace("@Comentario", Documento.Comentarios);


        var tabla = "";

        for (var i = 0; i < Documento.Detalle.length; i++) {

            var Prod = Productos.find(a => a.id == Documento.Detalle[i].idProducto)
            var Bod = Bodegas.find(a => a.id == Prod.idBodega);

            tabla += "<tr>" + "<td colspan='3'>  " + Prod.Codigo + "-" + Prod.Nombre + " - BOD:" + Bod.CodSAP + "  </td></tr>";


            tabla += "<tr>";

            tabla += "<td style='text-align left;'>" + Documento.Detalle[i].Cantidad + " </td>";

            tabla += "<td style='text-align left;'>" + formatoDecimal(Documento.Detalle[i].PrecioUnitario) + " </td>";
            tabla += "<td style='text-align left;'>" + formatoDecimal(Documento.Detalle[i].TotalLinea) + " </td>";
            //tabla += "<p style=' text-align left; color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>" + Prod.Codigo + "-" + Prod.Nombre + " </p>";



            tabla += "</tr>";

        }
        texto = texto.replace("@Tabla", tabla);

        if (Documento.Moneda == "CRC") {
            texto = texto.replace("@SubTotal", "₡" + formatoDecimal(Documento.Subtotal));
            texto = texto.replace("@TotalDescuento", "₡" + formatoDecimal(Documento.TotalDescuento));
            texto = texto.replace("@TotalImpuestos", "₡" + formatoDecimal(Documento.TotalImpuestos));
            texto = texto.replace("@Total", "₡" + formatoDecimal(Documento.TotalCompra + Documento.Redondeo));
        } else {
            texto = texto.replace("@SubTotal", "$" + formatoDecimal(Documento.Subtotal));
            texto = texto.replace("@TotalDescuento", "$" + formatoDecimal(Documento.TotalDescuento));
            texto = texto.replace("@TotalImpuestos", "$" + formatoDecimal(Documento.TotalImpuestos));
            texto = texto.replace("@Total", "$" + formatoDecimal(Documento.TotalCompra + Documento.Redondeo));
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

function ImprimirTiqueteC() {
    try {



        var ventana = window.open('', 'PRINT', 'height=400,width=600');
        var texto = htmlCredito2;
        texto = texto.replace("@Fecha", Documento.Fecha.split("T")[0]);
        texto = texto.replace("@NumInterno", Documento.id);
        texto = texto.replace("@CodSuc", Documento.CodSuc);
        texto = texto.replace("@NumComprobante", Documento.ConsecutivoHacienda);
        texto = texto.replace("@NumFactura", Documento.id);

        var cond = CP.find(a => a.id == Documento.idCondPago);
        texto = texto.replace("@selectCondPago", cond.Nombre);


        if (Documento.tipoDocumento == "04") {
            texto = texto.replace("FACTURA", "TIQUETE");

        }
        var Cli = Clientes.find(a => a.id == Documento.idCliente);
        texto = texto.replace("@CodCliente", " " + Cli.Codigo);

        
        texto = texto.replace("@NombreCliente", Cli.Nombre);
        texto = texto.replace("@Vendedor", Vendedor.Nombre);
        texto = texto.replace("@Comentario", Documento.Comentarios);


        var tabla = "";

        for (var i = 0; i < Documento.Detalle.length; i++) {

            var Prod = Productos.find(a => a.id == Documento.Detalle[i].idProducto);
            var Bod = Bodegas.find(a => a.id == Prod.idBodega);

            tabla += "<tr>" + "<td colspan='3'>  " + Prod.Codigo + "-" + Prod.Nombre + " - BOD:" + Bod.CodSAP + "  </td></tr>";


            tabla += "<tr>";

            tabla += "<td style='text-align left;'>" + Documento.Detalle[i].Cantidad + " </td>";

            tabla += "<td style='text-align left;'>" + formatoDecimal(Documento.Detalle[i].PrecioUnitario) + " </td>";
            tabla += "<td style='text-align left;'>" + formatoDecimal(Documento.Detalle[i].TotalLinea) + " </td>";
            //tabla += "<p style=' text-align left; color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>" + Prod.Codigo + "-" + Prod.Nombre + " </p>";



            tabla += "</tr>";

        }
        texto = texto.replace("@Tabla", tabla);

        if (Documento.Moneda == "CRC") {
            texto = texto.replace("@SubTotal", "₡" + formatoDecimal(Documento.Subtotal));
            texto = texto.replace("@TotalDescuento", "₡" + formatoDecimal(Documento.TotalDescuento));
            texto = texto.replace("@TotalImpuestos", "₡" + formatoDecimal(Documento.TotalImpuestos));
            texto = texto.replace("@Redondeo", "₡" + formatoDecimal(Documento.Redondeo));
            texto = texto.replace("@Total", "₡" + formatoDecimal(Documento.TotalCompra + Documento.Redondeo));
        } else {
            texto = texto.replace("@SubTotal", "$" + formatoDecimal(Documento.Subtotal));
            texto = texto.replace("@TotalDescuento", "$" + formatoDecimal(Documento.TotalDescuento));
            texto = texto.replace("@TotalImpuestos", "$" + formatoDecimal(Documento.TotalImpuestos));
            texto = texto.replace("@Redondeo", "$" + formatoDecimal(Documento.Redondeo));
            texto = texto.replace("@Total", "$" + formatoDecimal(Documento.TotalCompra + Documento.Redondeo));
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
function ImprimirFactura() {
    try {



        var ventana = window.open('', 'PRINT', 'height=400,width=600');
        var texto = htmlCredito;
        texto = texto.replace("@Fecha", Documento.Fecha.split("T")[0]);
        texto = texto.replace("@NumInterno", Documento.id);
        texto = texto.replace("@CodSuc", Documento.CodSuc);
        texto = texto.replace("@NumComprobante", Documento.ClaveHacienda);
        texto = texto.replace("@NumFactura", Documento.ConsecutivoHacienda);



        if (Documento.tipoDocumento == "04") {
            texto = texto.replace("FACTURA", "TIQUETE");

        }
        var Cli = Clientes.find(a => a.id == Documento.idCliente);
        texto = texto.replace("@CodCliente", " " + Cli.Codigo);
        texto = texto.replace("@idCliente", " " + Documento.idCliente);

     
        texto = texto.replace("@NombreCliente", Cli.Nombre);
        texto = texto.replace("@DireccionCliente", Cli.Sennas);

        texto = texto.replace("@Vendedor", Vendedor.Nombre);

        var cond = CP.find(a => a.id == Documento.idCondPago);
        texto = texto.replace("@selectCondPago", cond.Nombre);

        texto = texto.replace("@FechaVencimiento", "");
        texto = texto.replace("@NumOrden", "");
        texto = texto.replace("@FechaEnvio", "");
        texto = texto.replace("@TipoCambio", TipoCambio[0].TipoCambio);

        texto = texto.replace("@TotalLetras", NumeroALetras(Documento.TotalCompra + Documento.Redondeo));






        var tabla = "";

        for (var i = 0; i < Documento.Detalle.length; i++) {

            var Prod = Productos.find(a => a.id == Documento.Detalle[i].idProducto)

            tabla += "<tr>";
            tabla += "<td align ='center'>" + Documento.Detalle[i].Cantidad + " </td>";
            tabla += "<td align ='left'>" + Prod.Codigo + " </td>";

            tabla += "<td  align ='left' style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>" + Prod.Nombre + " </td>";
            tabla += "<td  align ='right'>" + formatoDecimal(Documento.Detalle[i].PrecioUnitario) + " </td>";
            tabla += "<td  align ='right'>" + formatoDecimal(Documento.Detalle[i].TotalLinea) + " </td>";




            tabla += "</tr>";

        }
        texto = texto.replace("@INYECTADO", tabla);

        if (Documento.Moneda == "CRC") {
            texto = texto.replace("@SubTotal", "₡" + formatoDecimalX(Documento.Subtotal));
            texto = texto.replace("@TotalDescuento", "₡" + formatoDecimalX(Documento.TotalDescuento));
            texto = texto.replace("@TotalImpuestos", "₡" + formatoDecimalX(Documento.TotalImpuestos));
            texto = texto.replace("@Redondeo", "₡" + formatoDecimalX(Documento.Redondeo));
            texto = texto.replace("@Total", "₡" + formatoDecimalX(Documento.TotalCompra + Documento.Redondeo));
        } else {
            texto = texto.replace("@SubTotal", "$" + formatoDecimal(Documento.Subtotal));
            texto = texto.replace("@TotalDescuento", "$" + formatoDecimal(Documento.TotalDescuento));
            texto = texto.replace("@TotalImpuestos", "$" + formatoDecimal(Documento.TotalImpuestos));
            texto = texto.replace("@Redondeo", "$" + formatoDecimal(Documento.Redondeo));
            texto = texto.replace("@Total", "$" + formatoDecimal(Documento.TotalCompra + Documento.Redondeo));
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