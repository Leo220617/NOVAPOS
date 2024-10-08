﻿
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
var CB = [];
var CP = [];
var Vendedores = [];
var Bodega = [];


function Recuperar() {
    try {
        Cantones = JSON.parse($("#Cantones").val());
        Distritos = JSON.parse($("#Distritos").val());
        Barrios = JSON.parse($("#Barrios").val());
        Clientes = JSON.parse($("#Clientes").val());
        Vendedores = JSON.parse($("#Vendedores").val());
        Productos = JSON.parse($("#Productos").val());
        Impuestos = JSON.parse($("#Impuestos").val());
        Exoneraciones = JSON.parse($("#Exoneraciones").val());
        Documento = JSON.parse($("#Documento").val());
        TipoCambio = JSON.parse($("#TipoCambio").val());
        CB = JSON.parse($("#CB").val());
        CP = JSON.parse($("#CP").val());
        Bodega = JSON.parse($("#Bodega").val());

        ExoneracionesCliente = [];

        RellenaClientes();
        RellenaVendedores();
        RellenaExoneraciones();
        maskCedula();
        RecuperarInformacion();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e

        })
    }
   
}

function RecuperarInformacion() {
    try {
        $("#ClienteSeleccionado").val(Documento.idCliente);
        $("#Fecha").val(Documento.Fecha);

        $("#selectMoneda").val(Documento.Moneda);
        $("#selectTD").val(Documento.TipoDocumento);
        $("#selectVendedor").val(Documento.idVendedor);

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
                PorExoneracion: Exoneraciones.find(a => a.id == Documento.Detalle[i].idExoneracion) == undefined ? 0 : Exoneraciones.find(a => a.id == Documento.Detalle[i].idExoneracion).PorExon,
                
            };
            ProdCadena.push(Producto);
        }
        for (var i = 0; i < Documento.MetodosPagos.length; i++) {
            var Metodo = Documento.MetodosPagos[i];
            switch (Metodo.Metodo) {
                case "Efectivo":
                    {


                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            Monto: parseFloat(Metodo.Monto),
                            BIN: "",
                            NumReferencia: "",
                            NumCheque: "",
                            Metodo: "Efectivo",
                            PagadoCon: parseFloat(0)
                        };
                        MetodosPagos.push(Detalle);

                        break;
                    }
                case "Tarjeta":
                    {
                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            Monto: parseFloat(Metodo.Monto),
                            BIN: Metodo.BIN,
                            NumReferencia: Metodo.NumReferencia,
                            NumCheque: "",
                            Metodo: "Tarjeta",
                            PagadoCon: 0
                        };
                        MetodosPagos.push(Detalle);

                        break;
                    }
                case "Cheque":
                    {
                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            Monto: parseFloat(Metodo.Monto),
                            BIN: "",
                            NumReferencia: "",
                            NumCheque: Metodo.NumCheque,
                            Metodo: "Cheque",
                            PagadoCon: 0
                        };
                        MetodosPagos.push(Detalle);
                        break;
                    }
                case "Otros":
                    {
                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            Monto: parseFloat(Metodo.Monto),
                            BIN: "",
                            NumReferencia: "",
                            NumCheque: "",
                            Metodo: Metodo.Metodo,
                            PagadoCon: 0
                        };
                        MetodosPagos.push(Detalle);

                        break;
                    }
                default:
                    {
                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            Monto: parseFloat(Metodo.Monto),
                            BIN: "",
                            NumReferencia: "",
                            NumCheque: "",
                            Metodo: Metodo.Metodo,
                            PagadoCon: 0
                        };
                        MetodosPagos.push(Detalle);
                        break;
                    }
            }



        }
        RellenaTablaPagos();
        calcularPago();
        RellenaTabla();
        onChangeCliente();
        ValidarStocks();

        $("#selectCondPago").val(Documento.idCondPago);

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}
function ValidarStocks() {
    try {
        for (var i = 0; i < Documento.Detalle.length; i++) {
            var PE = Productos.find(a => a.id == Documento.Detalle[i].idProducto);
            if ((PE.Stock - ProdCadena[i].Cantidad) < 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'El producto' + ' ' + ProdCadena[i].Descripcion + ' ' + 'NO tiene' + ' ' + ProdCadena[i].Cantidad + '' + ' unidades en stock, el stock real es de' + ' ' + PE.Stock

                })
                ProdCadena[i].Cantidad = PE.Stock;

            }


        }
        ValidarTotales();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar informacion ' + e

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
            var idCliente = $("#ClienteSeleccionado").val();
            var Cliente = Clientes.find(a => a.id == idCliente);
            var IMP2 = Impuestos.find(a => a.Tarifa == 1);
            var EX = Exoneraciones.find(a => a.id == ProdCadena[i].idExoneracion);

            var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);
            var ImpuestoTarifa = (Cliente.MAG == true && PE.MAG == true && (EX == undefined || EX.PorExon < 13) ? IMP2.id : PE.idImpuesto);
            var IMP = Impuestos.find(a => a.id == ImpuestoTarifa);

            var calculoIMP = IMP.Tarifa;

            ProdCadena[i].Descuento = (ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario) * (ProdCadena[i].PorDescto / 100);
            ProdCadena[i].TotalImpuesto = ((ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario) - ProdCadena[i].Descuento) * (calculoIMP / 100);
            //EX => Exoneracion
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

function onChangeMoneda() {
    try {

        var subtotalG = 0;
        var impuestoG = 0;
        var descuentoG = 0;
        var totalG = 0;

        var Moneda = $("#selectMoneda").val();

        for (var i = 0; i < ProdCadena.length; i++) {
            var Produc = Productos.find(a => a.id == ProdCadena[i].idProducto);

            if (ProdCadena[i].Moneda != Moneda) {
                var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

                if (Moneda != "CRC") {

                    ProdCadena[i].Moneda = Moneda;
                    ProdCadena[i].PrecioUnitario = ProdCadena[i].PrecioUnitario / TipodeCambio.TipoCambio;
                    ProdCadena[i].Descuento = ProdCadena[i].Descuento / TipodeCambio.TipoCambio;
                    ProdCadena[i].TotalImpuesto = ProdCadena[i].TotalImpuesto / TipodeCambio.TipoCambio;
                    ProdCadena[i].TotalLinea = ProdCadena[i].TotalLinea / TipodeCambio.TipoCambio;





                } else {

                    ProdCadena[i].Moneda = Moneda;
                    ProdCadena[i].PrecioUnitario = ProdCadena[i].PrecioUnitario * TipodeCambio.TipoCambio;
                    ProdCadena[i].Descuento = ProdCadena[i].Descuento * TipodeCambio.TipoCambio;
                    ProdCadena[i].TotalImpuesto = ProdCadena[i].TotalImpuesto * TipodeCambio.TipoCambio;
                    ProdCadena[i].TotalLinea = ProdCadena[i].TotalLinea * TipodeCambio.TipoCambio;

                }


            }

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
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}
function RellenaVendedores() {
    try {
        var html = "";
        $("#selectVendedor").html(html);
        html += "<option value='0' > Seleccione Vendedor </option>";

        for (var i = 0; i < Vendedores.length; i++) {
            html += "<option value='" + Vendedores[i].id + "' > " + Vendedores[i].CodSAP + " - " + Vendedores[i].Nombre + " </option>";
        }



        $("#selectVendedor").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

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
            text: 'Ha ocurrido un error al intentar recuperar ' + e

        })
    }
   
}
function RellenaProductos() {
    try {
        var html = "";
        $("#ProductoSeleccionado").html(html);

        html += "<option value='0' > Seleccione Producto </option>";

        for (var i = 0; i < ProdClientes.length; i++) {
            var Bodegas = Bodega.find(a => a.id == ProdClientes[i].idBodega) == undefined ? undefined : Bodega.find(a => a.id == ProdClientes[i].idBodega);
            html += "<option value='" + ProdClientes[i].id + "' > " + ProdClientes[i].Codigo + " - " + ProdClientes[i].Nombre + " -  Precio: " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " -  Stock: " + formatoDecimal(parseFloat(ProdClientes[i].Stock).toFixed(2)) + " -  BOD: " + Bodegas.CodSAP + " </option>";
        }



        $("#ProductoSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e

        })
    }

   
}

function RellenaExoneraciones() {

    try {
        var Producto = Productos.find(a => a.id == $("#ProductoSeleccionado").val());

        var html = "";
        $("#exoneracion").html(html);

        html += "<option value='0' > Seleccione Exoneracion </option>";

        if (Producto != undefined) {
            var ProductoExoneracion = ExoneracionesCliente != undefined ? ExoneracionesCliente.Detalle.filter(a => a.CodCabys == Producto.Cabys) : [];
            if (ProductoExoneracion.length > 0) {
                html += "<option value='" + ExoneracionesCliente.id + "' selected > " + ExoneracionesCliente.NumDoc + " </option>";

            }
        }



        $("#exoneracion").html(html);





    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }

}

function onChangeCliente() {
    try {
        var idCliente = $("#ClienteSeleccionado").val();

        var Cliente = Clientes.find(a => a.id == idCliente);
        var CondP = CP.filter(a => a.id == Cliente.idCondicionPago);

        //Preguntarle a CP cual es la de 30 dias

        if (CondP.length > 0) {
            var Cond30 = CP.filter(a => a.Dias <= CondP[0].Dias).sort(function (a, b) {
                if (a.Dias > b.Dias) {
                    return 1;
                }
                if (a.Dias < b.Dias) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
            RellenaCondiciones(Cond30);

        } else {
            var Cond30 = [];
            RellenaCondiciones(Cond30);
        }

    

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
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e

        })
    }
   

}
function RellenaCondiciones(CPS) {
    try {
        var text = "";
        $("#selectCondPago").html(text);

        var Contado = CP.find(a => a.Nombre == "Contado");

        text += "<option value='" + Contado.id + "' selected> " + Contado.Nombre + " </option>";


        for (var i = 0; i < CPS.length; i++) {
            if (CPS[i].id != Contado.id) {
                text += "<option value='" + CPS[i].id + "'> " + CPS[i].Nombre + " </option>";

            }
        }


        $("#selectCondPago").html(text);


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }
}
function ExoneracionxCliente() {
    var idCliente = $("#ClienteSeleccionado").val();
    ExoneracionesCliente = Exoneraciones.filter(a => a.idCliente == idCliente && a.Activo == true);

    RellenaExoneraciones();
}
function onChangeProducto() {
    try {
        var idProducto = $("#ProductoSeleccionado").val();

        var Producto = ProdClientes.find(a => a.id == idProducto);

        var idCliente = $("#ClienteSeleccionado").val();
        var Cliente = Clientes.find(a => a.id == idCliente);


        if (Producto != undefined) {
            $("#inputPrecio").val(parseFloat(Producto.PrecioUnitario));
            $("#inputCabys").val(Producto.Cabys);
            ExoneracionxCliente();
            //EX => Exoneracion
            var Exonera = parseInt($("#exoneracion").val());
            var EX = Exoneraciones.find(a => a.id == Exonera);
            if (EX == undefined || EX.PorExon < 13) {
                if (Cliente != undefined) {
                    if (Cliente.MAG == true && Producto.MAG == true) {

                        var IMP = Impuestos.find(a => a.Tarifa == 1);

                        if (IMP != undefined) {
                            $("#impuesto").val(IMP.id);
                        } else {
                            $("#impuesto").val(Producto.idImpuesto);
                        }

                    } else {
                        $("#impuesto").val(Producto.idImpuesto);
                    }
                } else {
                    $("#impuesto").val(Producto.idImpuesto);
                }
            } else {
                $("#impuesto").val(Producto.idImpuesto);
            }
            //Termina Exoneracion



            $("#MonedaProducto").val(Producto.Moneda);
        } else {
            $("#cantidad").val(1);

            $("#inputPrecio").val(0);
            $("#inputCabys").val("");
            $("#impuesto").val(0);
            $("#MonedaProducto").val("");
            $("#descuento").val(0);
        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }




}


function ModificaSelects(i) {
    var codProvincia = parseInt($("#selectP").val());
    var codCanton = parseInt($("#selectC").val());
    var codDistrito = parseInt($("#selectD").val());

    if (i == 0) {
        RellenaCantones(Cantones.filter(a => a.CodProvincia == codProvincia));
        RellenaDistritos(Distritos.filter(a => a.CodProvincia == codProvincia && a.CodCanton == codCanton));
        RellenaBarrios(Barrios.filter(a => a.CodProvincia == codProvincia && a.CodCanton == codCanton && a.CodDistrito == codDistrito));

    }

    if (i == 1) {
        RellenaCantones(Cantones.filter(a => a.CodProvincia == codProvincia));
        RellenaDistritos(Distritos.filter(a => a.CodProvincia == codProvincia && a.CodCanton == codCanton));
        RellenaBarrios(Barrios.filter(a => a.CodProvincia == codProvincia && a.CodCanton == codCanton && a.CodDistrito == codDistrito));

    }
    if (i == 2) {

        RellenaDistritos(Distritos.filter(a => a.CodProvincia == codProvincia && a.CodCanton == codCanton));
        RellenaBarrios(Barrios.filter(a => a.CodProvincia == codProvincia && a.CodCanton == codCanton && a.CodDistrito == codDistrito));

    }

    if (i == 3) {
        RellenaBarrios(Barrios.filter(a => a.CodProvincia == codProvincia && a.CodCanton == codCanton && a.CodDistrito == codDistrito));
    }

}

function RellenaCantones(ListCantones) {
    var sOptions = '';

    $("#selectC").html('');

    for (var i = 0; i < ListCantones.length; i++) {

        sOptions += '<option value="' + ListCantones[i].CodCanton + '">' + ListCantones[i].NomCanton + '</option>';

    }
    $("#selectC").html(sOptions);
}

function RellenaDistritos(ListDistritos) {
    var sOptions = '';

    $("#selectD").html('');

    for (var i = 0; i < ListDistritos.length; i++) {

        sOptions += '<option value="' + ListDistritos[i].CodDistrito + '">' + ListDistritos[i].NomDistrito + '</option>';

    }
    $("#selectD").html(sOptions);
}

function RellenaBarrios(ListBarrios) {
    var sOptions = '';

    $("#selectB").html('');

    for (var i = 0; i < ListBarrios.length; i++) {

        sOptions += '<option value="' + ListBarrios[i].CodBarrio + '">' + ListBarrios[i].NomBarrio + '</option>';

    }
    $("#selectB").html(sOptions);
}

function AbrirModalAgregarCliente() {
    $("#ModalAgregarCliente").modal("show");
}

function validar(cliente) {
    try {
        if (cliente.idListaPrecios == "" || cliente.idListaPrecios == null) {
            return false;
        } else if (cliente.Nombre == "" || cliente.Nombre == null) {
            return false;
        }
        else if (cliente.Cedula == "" || cliente.Cedula == null) {
            return false;


        } else if (cliente.Email == "" || cliente.Email == null) {
            return false;

        } else if (cliente.Telefono == "" || cliente.Telefono == null) {
            return false;

        } else if (cliente.Sennas == "" || cliente.Sennas == null) {
            return false;

        } else if (cliente.CorreoPublicitario == "" || cliente.CorreoPublicitario == null) {
            return false;

        } else if (cliente.idGrupo == "" || cliente.idGrupo == null) {
            return false;
        }

        else {
            return true;
        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e

        })
    }
   
}

function LimpiarDatosCliente() {
    try {
        $("#idListaP").val("1").trigger('change.select2');
        $("#idGrupo").val("1").trigger('change.select2');
        $("#Nombre").val("");
        $("#selectTP").val("1").trigger('change.select2');
        $("#Cedula").val("");
        $("#Email").val("");
        $("#Telefono").val("");
        $("#selectP").val("1").trigger('change.select2');
        $("#Sennas").val("");
        $("#CorreoPublicitario").val("");
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e

        })
    }
  
}

//Agregar Cliente
function AgregarCliente() {
    try {
        var Cliente =
        {
            id: 0,
            Codigo: "",
            idListaPrecios: $("#idListaP").val(),
            Nombre: $("#Nombre").val(),
            TipoCedula: $("#selectTP").val(),
            Cedula: $("#Cedula").val(),
            Email: $("#Email").val(),
            CorreoPublicitario: $("#CorreoPublicitario").val(),
            idGrupo: $("#idGrupo").val(),
            CodPais: "506",
            Telefono: $("#Telefono").val(),
            Provincia: $("#selectP").val(),
            Canton: $("#selectC").val(),
            Distrito: $("#selectD").val(),
            Barrio: $("#selectB").val(),
            Sennas: $("#Sennas").val(),
            Saldo: 0,
            Activo: true,
            ProcesadoSAP: false,
            idCondicionPago: 0
        };

        if (validar(Cliente)) {
            Swal.fire({
                title: '¿Desea guardar la información de este cliente?',
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

                    var recibidos = JSON.stringify(Cliente);

                    $.ajax({
                        type: 'POST',

                        url: $("#urlCliente").val(),
                        dataType: 'json',
                        data: { recibidos: Cliente },
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.cliente);
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

                                        LimpiarDatosCliente();
                                        $("#ModalAgregarCliente").modal("hide");

                                        var ClienteInsertar =
                                        {
                                            id: json.cliente.id,
                                            Codigo: json.cliente.codigo,
                                            idListaPrecios: json.cliente.idListaPrecios,
                                            Nombre: json.cliente.nombre,
                                            TipoCedula: json.cliente.tipoCedula,
                                            Cedula: json.cliente.cedula,
                                            Email: json.cliente.email,
                                            CorreoPublicitario: json.cliente.correoPublicitario,
                                            idGrupo: json.cliente.idGrupo,
                                            CodPais: json.cliente.codPais,
                                            Telefono: json.cliente.telefono,
                                            Provincia: json.cliente.provincia,
                                            Canton: json.cliente.canton,
                                            Distrito: json.cliente.distrito,
                                            Barrio: json.cliente.barrio,
                                            Sennas: json.cliente.sennas,
                                            Saldo: json.cliente.saldo,
                                            Activo: true,
                                            ProcesadoSAP: false,
                                            idCondicionPago: 0
                                        };

                                        Clientes.push(ClienteInsertar);
                                        RellenaClientes();
                                        $("#ClienteSeleccionado").val(json.cliente.id).trigger('change.select2');


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
                text: 'Pareciera que aún falta un campo por llenar'

            });
        }



    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar agregar ' + e

        })
    }
}
///
function RellenaTabla() {
    try {
        var html = "";
        $("#tbody").html(html);


        for (var i = 0; i < ProdCadena.length; i++) {
            html += "<tr>";

            html += "<td> " + (i + 1) + " </td>";

            html += "<td > " + ProdCadena[i].Descripcion + " </td>";
            html += "<td class='text-center'> " + formatoDecimal(parseFloat(ProdCadena[i].Cantidad).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PrecioUnitario).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].Descuento).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].TotalImpuesto).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PorExoneracion).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].TotalLinea).toFixed(2)) + " </td>";
            html += "<td class='text-center'> <a class='fa fa-trash' onclick='javascript:EliminarProducto(" + i + ") '> </a> </td>";

            html += "</tr>";


        }



        $("#tbody").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar agregar ' + e

        })
    }
   
}
function cantidadRepetidos(palabra, separador) {


    return palabra.split(separador).length - 1;
}
function ReplaceLetra(palabra) {
    try {
        var cantidad = cantidadRepetidos(palabra, ",");
        for (var i = 0; i < cantidad; i++) {
            palabra = palabra.replace(",", "");
        }

        //var cantidad2 = cantidadRepetidos(palabra, ".");
        //for (var i = 0; i < cantidad2; i++) {
        //    palabra = palabra.replace(".", "");
        //}
        return palabra;
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar agregar ' + e

        })
    }
   
}


function AgregarProductoTabla() {
    try {
        var subtotalG = parseFloat(ReplaceLetra($("#subG").text()));
        var impuestoG = parseFloat(ReplaceLetra($("#impG").text()));
        var descuentoG = parseFloat(ReplaceLetra($("#descG").text()));
        var totalG = parseFloat(ReplaceLetra($("#totG").text()));

        var id = $("#ProductoSeleccionado").val();
        var PE = ProdClientes.find(a => a.id == id);

        var Producto =
        {
            idEncabezado: 0,
            Descripcion: PE.Codigo + " - " + PE.Nombre,
            Moneda: PE.Moneda,
            idProducto: PE.id,
            NumLinea: 0,
            Cantidad: parseFloat($("#cantidad").val()),
            TotalImpuesto: 0,
            PrecioUnitario: parseFloat($("#inputPrecio").val()),
            PorDescto: parseFloat($("#descuento").val()),
            Descuento: 0,
            TotalLinea: 0,
            Cabys: $("#inputCabys").val(),
            idExoneracion: $("#exoneracion").val(),
            PorExoneracion: 0
        };
        if ((PE.Stock - Producto.Cantidad) < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Producto sin stock valido'

            })
        } else {
            if (Producto.Cabys.length >= 13) {


                var ImpuestoTarifa = $("#impuesto").val();
                var IMP = Impuestos.find(a => a.id == ImpuestoTarifa);

                var calculoIMP = IMP.Tarifa;

                Producto.Descuento = (Producto.Cantidad * Producto.PrecioUnitario) * (Producto.PorDescto / 100);
                Producto.TotalImpuesto = ((Producto.Cantidad * Producto.PrecioUnitario) - Producto.Descuento) * (calculoIMP / 100);
                //EX => Exoneracion
                var EX = Exoneraciones.find(a => a.id == Producto.idExoneracion);
                if (EX != undefined) {
                    var ValorExonerado = (EX.PorExon / 100);
                    var TarifaExonerado = ((Producto.Cantidad * Producto.PrecioUnitario) - Producto.Descuento) * ValorExonerado;
                    Producto.TotalImpuesto -= TarifaExonerado;
                    Producto.PorExoneracion = EX.PorExon;
                }
                //Termina Exoneracion


                Producto.TotalLinea = (Producto.Cantidad * Producto.PrecioUnitario) - Producto.Descuento + Producto.TotalImpuesto;

                subtotalG += (Producto.Cantidad * Producto.PrecioUnitario);
                impuestoG += Producto.TotalImpuesto;
                descuentoG += Producto.Descuento;
                totalG += Producto.TotalLinea;

                $("#subG").text(formatoDecimal(subtotalG.toFixed(2)));
                $("#descG").text(formatoDecimal(descuentoG.toFixed(2)));
                $("#impG").text(formatoDecimal(impuestoG.toFixed(2)));
                $("#totG").text(formatoDecimal(totalG.toFixed(2)));

                ProdCadena.push(Producto);

                RellenaTabla();
                onChangeMoneda();

                $("#ProductoSeleccionado").val("0").trigger('change.select2');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Producto sin Cabys valido'

                })
            }
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error: ' + e

        })
    }








}

function EliminarProducto(i) {
    try {
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
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e

        })
    }
 
}

//Generar
function Generar() {
    try {


        var EncDocumento = {
            id: $("#id").val(),
            idCliente: $("#ClienteSeleccionado").val(),
            idVendedor: $("#selectVendedor").val(),
            idUsuarioCreador: 0,
            idCondPago: $("#selectCondPago").val(),

            Fecha: $("#Fecha").val(),
            FechaVencimiento: $("#Fecha").val(),
            Comentarios: $("#inputComentarios").val(),
            Subtotal: parseFloat(ReplaceLetra($("#subG").text())),
            TotalImpuestos: parseFloat(ReplaceLetra($("#impG").text())),
            TotalDescuento: parseFloat(ReplaceLetra($("#descG").text())),
            TotalCompra: parseFloat(ReplaceLetra($("#totG").text())),
            PorDescto: parseFloat(ReplaceLetra($("#descuento").val())),
            CodSuc: "",
            Moneda: $("#selectMoneda").val(),
            TipoDocumento: $("#selectTD").val(),
            MetodosPagos: MetodosPagos,
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

                                        window.location.href = window.location.href.split("/Editar")[0];


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

    try {
        var Contado = CP.find(a => a.Nombre == "Contado");

        if ($("#selectCondPago").val() == Contado.id) {
            if (e.idCliente == "0" || e.idCliente == null) {
                return false;
            } //else if (e.FechaVencimiento == "" || e.FechaVencimiento == null) {
            //  return false;
            // }
            else if (e.Detalle.length == 0 || e.Detalle == null) {
                return false;
            }
            else if (e.MetodosPagos.length == 0 || e.MetodosPagos == null) {
                return false;
            } else if (sumArray(e.MetodosPagos) < e.TotalCompra) {
                return false;
            }
            else {
                return true;
            }
        } else {
            if (e.Detalle.length == 0 || e.Detalle == null) {
                return false;
            } else if (e.idCliente == "0" || e.idCliente == null) {
                return false;
            } else {
                return true;
            }
        }


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar agregar ' + e

        })
    }

}
function sumArray(array) {
    try {
        var suma = 0;
        for (var i = 0; i < array.length; i++) {
            suma += parseFloat(array[i].Monto);
        }
        return suma;
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e

        })
    }
    
}
function BuscarCliente() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://apis.gometa.org/cedulas/' + $("#Cedula").val() + '&key=gkUkysPxCKUYWZS', //Nombre del metodo
        data: {},
        success: function (result) {

            console.log(result);

            if (result.nombre != undefined) {
                $("#Nombre").val(result.nombre);
                $("#selectTP").val(result.tipoIdentificacion);
                $("#Nombre").attr("readonly", "readonly");


            } else {
                $("#Nombre").removeAttr("readonly");
            }



        },
        beforeSend: function () {

        },
        complete: function () {

        }
    });
}


///////Impresion

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
            filename: 'Documento.pdf',
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

//////Metodos pago
function AbrirPago() {
    try {
        var Contado = CP.find(a => a.Nombre == "Contado");

        if ($("#selectCondPago").val() == Contado.id) {
            var Total = parseFloat(ReplaceLetra($("#totG").text()));
            $("#totPago").text(formatoDecimal(Total));
            $("#fatPago").text(formatoDecimal(Total));


            onChangeMetodo();
            RellenaCB();

            $("#modalPagos").modal("show");
        } else {
            Generar();
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

        for (var i = 0; i < CB.length; i++) {

            text += "<option value= '" + CB[i].id + "' > " + CB[i].Nombre + " </option>";
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
        var Total = parseFloat(ReplaceLetra($("#totG").text())) - parseFloat(ReplaceLetra($("#pagPago").text()));
        $("#MontoPago").val(Total)
        switch (Metodo) {
            case "Efectivo":
                {
                    $(".TARJETADIV").hide();
                    $(".OTRODIV").hide();
                    $(".CHEQUEDIV").hide();
                    $(".EFECTIVODIV").show();

                    break;
                }
            case "Tarjeta":
                {
                    $(".OTRODIV").hide();
                    $(".EFECTIVODIV").hide();

                    $(".TARJETADIV").show();
                    $(".CHEQUEDIV").hide();

                    break;
                }
            case "Cheque":
                {
                    $(".OTRODIV").hide();
                    $(".EFECTIVODIV").hide();

                    $(".TARJETADIV").hide();
                    $(".CHEQUEDIV").show();
                    break;
                }
            case "Otros":
                {
                    $(".EFECTIVODIV").hide();

                    $(".TARJETADIV").hide();
                    $(".CHEQUEDIV").hide();
                    $(".OTRODIV").show();

                    break;
                }
            default:
                {
                    $(".EFECTIVODIV").hide();

                    $(".TARJETADIV").hide();
                    $(".OTRODIV").hide();
                    $(".CHEQUEDIV").hide();
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
function insertarPago() {
    try {

        var Metodo = $("#MetodoSeleccionado").val();
        if (validarMetodo()) {
            switch (Metodo) {
                case "Efectivo":
                    {


                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            idCuentaBancaria: $("#CuentaB").val(),

                            Monto: parseFloat(ReplaceLetra($("#MontoPago").val())),
                            BIN: "",
                            NumReferencia: "",
                            NumCheque: "",
                            Metodo: "Efectivo",
                            PagadoCon: parseFloat(ReplaceLetra($("#PagadoCon").val()))
                        };
                        MetodosPagos.push(Detalle);

                        break;
                    }
                case "Tarjeta":
                    {
                        var Detalle = {
                            id: 0,
                            idEncabezado: 0,
                            idCuentaBancaria: $("#CuentaB").val(),

                            Monto: parseFloat(ReplaceLetra($("#MontoPago").val())),
                            BIN: $("#BINPago").val(),
                            NumReferencia: $("#ReferenciaPago").val(),
                            NumCheque: "",
                            Metodo: "Tarjeta",
                            PagadoCon: 0
                        };
                        MetodosPagos.push(Detalle);

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
                            PagadoCon: 0
                        };
                        MetodosPagos.push(Detalle);
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
                            PagadoCon: 0
                        };
                        MetodosPagos.push(Detalle);

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
function validarMetodo() {
    try {
        var Metodo = $("#MetodoSeleccionado").val();
        var Total = parseFloat(ReplaceLetra($("#totG").text())) - parseFloat(ReplaceLetra($("#pagPago").text()));

        if (Total <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se puede ingresar montos mayores a lo pagado'

            })
            return false;
        }
        if (parseFloat($("#MontoPago").val()) > parseFloat(ReplaceLetra($("#fatPago").text()))) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se puede ingresar montos mayores a lo faltante'

            })
            return false;
        }
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

        for (var i = 0; i < MetodosPagos.length; i++) {
            text += "<tr>";
            text += "<td class='text-center'> " + MetodosPagos[i].Metodo + " </td>";
            text += "<td class='text-center'> " + MetodosPagos[i].BIN + " </td>";
            text += "<td class='text-center'> " + MetodosPagos[i].NumReferencia + " </td>";
            text += "<td class='text-center'> " + MetodosPagos[i].NumCheque + " </td>";
            text += "<td class='text-rigth'> " + formatoDecimal(MetodosPagos[i].Monto) + " </td>";
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


function calcularPago() {
    try {
        var Total = parseFloat(ReplaceLetra($("#totG").text()));
        var Faltante = 0;
        var Pagado = 0;

        var vuelto = 0;
        $("#vueltoPago").text(formatoDecimal(vuelto.toFixed(2)));

        for (var i = 0; i < MetodosPagos.length; i++) {
            Pagado += MetodosPagos[i].Monto;
            if (MetodosPagos[i].Metodo == "Efectivo") {
                if (MetodosPagos[i].PagadoCon > 0) {
                    vuelto += MetodosPagos[i].PagadoCon - MetodosPagos[i].Monto;

                }
            }
        }


        Faltante = Total - Pagado;

        $("#fatPago").text(formatoDecimal(Faltante));
        $("#pagPago").text(formatoDecimal(Pagado));
        $("#vueltoPago").text(formatoDecimal(vuelto));


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

        MetodosPagos.splice(i, 1);
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