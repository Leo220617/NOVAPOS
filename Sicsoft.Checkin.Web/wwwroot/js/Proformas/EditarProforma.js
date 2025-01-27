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
var Grupos = [];
var Productos = [];
var ProdClientes = [];
var Impuestos = [];
var Cantones = [];
var Distritos = [];
var Barrios = [];
var ProdCadena = [];
var Exoneraciones = [];
var Oferta = [];
var TipoCambio = [];
var CP = [];
var Vendedores = [];
var DES = [];
var Bodega = [];
var Sucursal = [];
var FP = false;
var Inicio = false;
var Duplicado = false;
var SeriesProductos = [];
var ProdSeries = [];
var LotesCadena = [];
var DetPromociones = [];
var Margenes = [];
var DetMargenes = [];
var Aprobaciones = [];
var Categorias = [];
var Pais = "";
var Empresa = "";
function CerrarPopUpLotes() {
    try {
        $('#listoCerrar').magnificPopup('close');
    } catch (e) {
        alert(e);
    }
}
function generarSelect2() {
    try {
        $(".loteSeleccionado").select2({
            dropdownParent: $("#test-form")
        });
    } catch (e) {

    }
}
function Recuperar() {
    try {
        Empresa = JSON.parse($("#Empresa").val());
        Cantones = JSON.parse($("#Cantones").val());
        Distritos = JSON.parse($("#Distritos").val());
        Barrios = JSON.parse($("#Barrios").val());
        Clientes = JSON.parse($("#Clientes").val());
        Aprobaciones = JSON.parse($("#Aprobaciones").val()) == null ? [] : JSON.parse($("#Aprobaciones").val());
        Grupos = JSON.parse($("#Grupos").val());
        Vendedores = JSON.parse($("#Vendedores").val());
        Productos = JSON.parse($("#Productos").val());
        Impuestos = JSON.parse($("#Impuestos").val());
        Exoneraciones = JSON.parse($("#Exoneraciones").val());
        Oferta = JSON.parse($("#Oferta").val());
        TipoCambio = JSON.parse($("#TipoCambio").val());
        CP = JSON.parse($("#CP").val());
        DES = JSON.parse($("#DES").val());
        Bodega = JSON.parse($("#Bodega").val());
        Sucursal = JSON.parse($("#Sucursal").val());
        ExoneracionesCliente = [];
        SeriesProductos = JSON.parse($("#SeriesProductos").val());
        DetPromociones = JSON.parse($("#DetPromociones").val());
        Margenes = JSON.parse($("#Margenes").val());
        DetMargenes = JSON.parse($("#DetMargenes").val());
        Categorias = JSON.parse($("#Categorias").val());
        Pais = JSON.parse($("#Pais").val());

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
        var lot = JSON.parse($("#Lotes").val());
        $("#ClienteSeleccionado").val(Oferta.idCliente);
        $("#selectTD").val(Oferta.TipoDocumento);
        $("#selectVendedor").val(Oferta.idVendedor);
        $("#Fecha").val(Oferta.Fecha);
        $("#selectMoneda").val(Oferta.Moneda);
        $("#selectTD").val(Oferta.TipoDocumento);
        $("#selectVendedor").val(Oferta.idVendedor);
        $("#inputComentarios").val(Oferta.Comentarios);
        $("#subG").text(formatoDecimal(Oferta.Subtotal.toFixed(2)));
        $("#impG").text(formatoDecimal(Oferta.TotalImpuestos.toFixed(2)));
        $("#descG").text(formatoDecimal(Oferta.TotalDescuento.toFixed(2)));
        $("#totG").text(formatoDecimal(Oferta.TotalCompra.toFixed(2)));
        $("#redondeo").text(formatoDecimal(Oferta.Redondeo.toFixed(2)));
        $("#descuento").text(formatoDecimal(Oferta.PorDescto.toFixed(2)));

        Inicio = true;

        for (var i = 0; i < Oferta.Detalle.length; i++) {
            var PE = Productos.find(a => a.id == Oferta.Detalle[i].idProducto);

            var Producto =
            {
                idEncabezado: 0,
                Descripcion: PE.Codigo + " - " + Oferta.Detalle[i].NomPro,
                idProducto: PE.id,
                Moneda: $("#selectMoneda").val(),

                NumLinea: 0,
                Cantidad: parseFloat(Oferta.Detalle[i].Cantidad),
                TotalImpuesto: parseFloat(Oferta.Detalle[i].TotalImpuesto.toFixed(2)),
                PrecioUnitario: parseFloat(Oferta.Detalle[i].PrecioUnitario.toFixed(2)),
                PorDescto: parseFloat(Oferta.Detalle[i].PorDescto.toFixed(2)),
                Descuento: parseFloat(Oferta.Detalle[i].Descuento.toFixed(2)),
                TotalLinea: parseFloat(Oferta.Detalle[i].TotalLinea.toFixed(2)),
                Cabys: Oferta.Detalle[i].Cabys,
                NomPro: Oferta.Detalle[i].NomPro,
                /*  idExoneracion: Oferta.Detalle[i].Cabys,*/
                Costo: PE.Costo,
                PorExoneracion: Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion) == undefined ? 0 : Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion).PorExon,
                /*    idExo: Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion) == undefined ? 0 : Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion).id*/
                idExoneracion: Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion) == undefined ? 0 : Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion).id,
                PrecioMin: 0,
                MargenMin: 0,
                Localizacion: PE.Localizacion


            };
            var DetMargen = DetMargenes.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Moneda == PE.Moneda);
            var Margen = Margenes.find(a => a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Moneda == PE.Moneda);
            var PrecioMin = 0;
            var MargenMin = 0;
            var idClientes = $("#ClienteSeleccionado").val();
            var Cliente = Clientes.find(a => a.id == idClientes);
            var DescuentoCliente = Cliente.Descuento / 100;

            if (DetMargen != undefined) {

                PrecioMin = DetMargen.PrecioMin;
                MargenMin = DetMargen.MargenMin;

                if (DescuentoCliente > 0) {
                    var PrecioCob = PE.Costo / (1 - (Margen.Cobertura / 100));
                    Producto.MargenMin = MargenMin - (MargenMin * DescuentoCliente);

                    var MargenNuevo = Producto.MargenMin / 100;

                    Producto.PrecioMin = PrecioCob / (1 - MargenNuevo);
                } else {
                    Producto.MargenMin = MargenMin;
                    Producto.PrecioMin = PrecioMin;

                }

            } else if (Margen != undefined) {
                var PrecioCob = PE.Costo / (1 - (Margen.Cobertura / 100));
                PrecioMin = PrecioCob / (1 - (Margen.MargenMin / 100));
                MargenMin = Margen.MargenMin;

                if (DescuentoCliente > 0) {
                    var PrecioCob = PE.Costo / (1 - (Margen.Cobertura / 100));
                    Producto.MargenMin = MargenMin - (MargenMin * DescuentoCliente);

                    var MargenNuevo = Producto.MargenMin / 100;

                    Producto.PrecioMin = PrecioCob / (1 - MargenNuevo);
                } else {
                    Producto.MargenMin = MargenMin;
                    Producto.PrecioMin = PrecioMin;

                }
            }






            ProdCadena.push(Producto);
        }

        for (var i = 0; i < lot.length; i++) {
            var lote = {
                id: i,
                idEncabezado: 0,
                Serie: lot[i].Serie,
                ItemCode: lot[i].ItemCode,
                Cantidad: lot[i].Cantidad,
                idDetalle: lot[i].idDetalle,
                Manufactura: lot[i].Manufactura


            }
            LotesCadena.push(lote);
        }
        var Exon = ProdCadena.find(a => a.PorExoneracion > 0);
        var Desc = ProdCadena.find(a => a.PorDescto > 0);
        if (ProdCadena.length > 0 && (Exon != undefined || Desc != undefined)) {

            $('#ClienteSeleccionado').prop('disabled', true);

        } else {

            $('#ClienteSeleccionado').prop('disabled', false);

        }
        RellenaTabla();
        onChangeCliente();
        $("#selectCondPago").val(Oferta.idCondPago);
        ValidarTotales();


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }
}
function RellenaSeriesProductos() {
    try {

        var idProducto = $("#ProductoSeleccionado").val();

        var Producto = ProdClientes.find(a => a.id == idProducto && a.Serie == true);

        ProdSeries = SeriesProductos.filter(a => a.CodProducto == Producto.Codigo);


        var html = "";
        $("#SerieSeleccionado").html(html);

        html += "<option value='0' > Seleccione Serie </option>";

        for (var i = 0; i < ProdSeries.length; i++) {

            html += "<option value='" + ProdSeries[i].Series + "' > " + "Serie: " + ProdSeries[i].Series + " -  Stock: " + ProdSeries[i].Cantidad + " </option>";

        }



        $("#SerieSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function onClickModal() {
    try {
        $("#plusButton").show();

        var idProducto = $("#ProductoSeleccionado").val();
        var Producto = ProdClientes.find(a => a.id == idProducto && a.Serie == true);

        var Bod = Bodega.find(a => a.id == Producto.idBodega);

        var LotesArray = LotesCadena.filter(a => a.ItemCode == Producto.Codigo);




        var sOptions = '';
        $("#rowLotes").html('');
        for (var i = 0; i < LotesArray.length; i++) {
            sOptions += "<div class='col-3' hidden> <div class='form-group'> <h5>ItemCode</h5> <div class='controls'> <input type='text' readonly id='producto" + i + "' class='form-control' value='" + LotesArray[i].ItemCode + "'> </div></div> </div> ";

            sOptions += "<div class='col-6'> <div class='form-group'> <h5>Lote</h5> <div class='controls'> <input type='text' readonly class='form-control' value='" + LotesArray[i].Serie + "' id='lote" + i + "'> </div></div> </div>";

            sOptions += "<div class='col-4'> <div class='form-group'> <h5>Cantidad</h5> <div class='controls'> <input type='number' readonly  id='cantidad" + i + "' class='form-control' value='" + LotesArray[i].Cantidad + "'> </div></div> </div> ";

            sOptions += "<div class='col-2'> <a style='margin-top: 35%; style='cursor: pointer;' ' onclick='javascript: EliminarLinea(" + LotesArray[i].id + ") ' class='fa fa-trash icono'> </a> </div>"

        }
        $("#rowLotes").html(sOptions);

        ContadorLotes();

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }

}

function rellenaRowLotes() {
    try {
        $("#plusButton").hide();
        var idProducto = $("#ProductoSeleccionado").val();
        var Producto = ProdClientes.find(a => a.id == idProducto && a.Serie == true);
        var LotesArray = LotesCadena.filter(a => a.ItemCode == Producto.Codigo);


        var Bod = Bodega.find(a => a.id == Producto.idBodega);
        ProdSeries = SeriesProductos.filter(a => a.CodProducto == Producto.Codigo && a.CodBodega == Bod.CodSAP);


        var sOptions = '';
        $("#rowLotes").html('');
        $("#rowLotes").html('');
        var z = 0;
        for (var i = 0; i < LotesArray.length; i++) {
            sOptions += "<div class='col-6'> <div class='form-group'> <h5>Serie</h5> <div class='controls'> <input type='text' readonly class='form-control' value='" + LotesArray[i].Serie + "' id='lote" + i + "'> </div></div> </div>";
            sOptions += "<div class='col-3' hidden> <div class='form-group'> <h5>ItemCode</h5> <div class='controls'> <input type='text' readonly id='producto" + i + "' class='form-control' value='" + LotesArray[i].ItemCode + "'> </div></div> </div> ";



            sOptions += "<div class='col-4'> <div class='form-group'> <h5>Cantidad</h5> <div class='controls'> <input type='number' readonly id='cantidad" + i + "' class='form-control' value='" + LotesArray[i].Cantidad + "'> </div></div> </div> ";
            sOptions += "<div class='col-2'> <a style='margin-top: 35%; style='cursor: pointer;' ' onclick='javascript: EliminarLinea(" + LotesArray[i].id + ") ' class='fa fa-trash icono'> </a> </div>"

            z++;
        }

        sOptions += "<div class='col-4'> <div class='form-group'> <h5>Serie</h5> <div class='controls'> <select class='form-control select2 loteSeleccionado' id='lote" + z + "' onchange='javascript: onChangeLote(" + z + ")'>  <option value='0' selected> Seleccione </option>";
        for (var zi = 0; zi < ProdSeries.length; zi++) {
            sOptions += " <option value= '" + ProdSeries[zi].Series + "' >" + ProdSeries[zi].Series + " | " + "Stock" + " " + ProdSeries[zi].Cantidad + "</option>";
        }
        sOptions += " </select>  </div></div> </div> ";
        /*  sOptions += "<div class='col-3' hidden> <div class='form-group'> <h5>ItemCode</h5> <div class='controls'> <input type='text' readonly id='producto" + z + "' class='form-control' value='" + ids + "'  > </div></div> </div> ";*/


        sOptions += " </select>  </div></div> </div> ";

        sOptions += "<div class='col-4'> <div class='form-group'> <h5>Cantidad</h5> <div class='controls'> <input type='number'  id='cantidad" + z + "' onchange='javascript: onChangeCantidad(" + z + ")' class='form-control'  > </div>  </div> </div> ";
        sOptions += "<div class='col-2'> <a style='margin-top: 35%; style='cursor: pointer;' ' onclick='javascript: GuardadoLinea(" + z + ") ' class='fa fa-check-square-o icono'> </a> </div>"
        $("#rowLotes").html(sOptions);

        generarSelect2();

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }

}


function ContadorLotes() {
    try {

        var idProducto = $("#ProductoSeleccionado").val();
        var Producto = ProdClientes.find(a => a.id == idProducto && a.Serie == true);
        var LotesArray = LotesCadena.filter(a => a.ItemCode == Producto.Codigo);






        var cantidad = $("#cantidad").val();
        var totalC = 0;
        var Contador = 0;
        for (var i = 0; i < LotesArray.length; i++) {
            totalC += parseInt(LotesArray[i].Cantidad);
        }
        Contador = parseInt(cantidad) - totalC;
        $("#Contador").text(Contador);

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}
function onChangeCantidad(z) {
    try {
        var idProducto = $("#ProductoSeleccionado").val();

        var Producto = ProdClientes.find(a => a.id == idProducto && a.Serie == true);

        var Bod = Bodega.find(a => a.id == Producto.idBodega);


        var Lote = ProdSeries.find(a => a.Series == $("#lote" + z).val() && a.CodProducto == Producto.Codigo && a.CodBodega == Bod.CodSAP);

        var CantidadDigitada = parseFloat($("#cantidad" + z).val());
        var CantidadLote = Lote.Cantidad;

        if (CantidadDigitada > CantidadLote) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No puede ser mayor a la cantidad real del lote, el maximo a elegir por este lote es:  ' + Lote.Cantidad

            });

            $("#cantidad" + z).val(Lote.Cantidad);
        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar cambiar la cantidad ' + e

        })
    }
}

function onChangeLote(z) {
    try {

        var idProducto = $("#ProductoSeleccionado").val();

        var Producto = ProdClientes.find(a => a.id == idProducto && a.Serie == true);

        var Bod = Bodega.find(a => a.id == Producto.idBodega);


        var Lote = ProdSeries.find(a => a.Series == $("#lote" + z).val() && a.CodProducto == Producto.Codigo && a.CodBodega == Bod.CodSAP);



        $("#cantidad" + z).prop('max', Lote.Cantidad);

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar cambiar el lote ' + e

        })
    }
}

function GuardadoLinea(z) {
    try {
        var idProducto = $("#ProductoSeleccionado").val();

        var Producto = ProdClientes.find(a => a.id == idProducto && a.Serie == true);




        var Bod = Bodega.find(a => a.id == Producto.idBodega);


        var Seriesx = SeriesProductos.find(a => a.CodProducto == Producto.Codigo && a.CodBodega == Bod.CodSAP && $("#lote" + z).val() == a.Series);

        var lote = {
            id: LotesCadena.length,
            idEncabezado: 0,
            Serie: $("#lote" + z).val(),
            ItemCode: Producto.Codigo,
            Cantidad: $("#cantidad" + z).val(),
            idDetalle: 0,
            Manufactura: Seriesx.Manufactura
        }
        if (ValidarLinea(z)) {
            LotesCadena.push(lote);
            ContadorLotes();



            onClickModal();
        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }



}


function EliminarLinea(z) {
    try {
        LotesCadena.splice(z, 1);
        for (var i = 0; i < LotesCadena.length; i++) {
            LotesCadena[i].id = i;
        }
        onClickModal();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }

}


function ValidarLinea(z) {
    try {

        var idProducto = $("#ProductoSeleccionado").val();

        var Producto = ProdClientes.find(a => a.id == idProducto && a.Serie == true);



        var LotesArray = LotesCadena.filter(a => a.ItemCode == Producto.Codigo);
        var cantidad = $("#cantidad").val();

        var cantidades = 0;

        for (var i = 0; i < LotesArray.length; i++) {
            cantidades += parseInt(LotesArray[i].Cantidad);
        }

        if ($("#lote" + z).val() == "") {
            return false;
        } else if ($("#cantidad" + z).val() == undefined || $("#cantidad" + z).val() <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Digite una cantidad valida'

            });
            return false;
        } else if (parseInt($("#cantidad" + z).val()) + cantidades > cantidad) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'La cantidad digita es mayor a la cantidad restante'

            });
            return false;
        }



        else {
            return true;
        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
        return false;
    }

}

function AbrirModalSeries(i) {
    try {
        $("#ModalObservarSeries").modal("show");
        var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);

        var Producto = ProdClientes.find(a => a.id == PE.id && a.Serie == true);

        var Bod = Bodega.find(a => a.id == Producto.idBodega);

        var LotesArray = LotesCadena.filter(a => a.ItemCode == Producto.Codigo);


        var LotesArray = LotesCadena.filter(a => a.ItemCode == Producto.Codigo);


        var Bod = Bodega.find(a => a.id == Producto.idBodega);
        ProdSeries = SeriesProductos.filter(a => a.CodProducto == Producto.Codigo && a.CodBodega == Bod.CodSAP);


        var sOptions = '';
        $("#rowLotes2").html('');
        $("#rowLotes2").html('');
        var z = 0;
        for (var i = 0; i < LotesArray.length; i++) {
            sOptions += "<div class='col-6'> <div class='form-group'> <h5>Serie</h5> <div class='controls'> <input type='text' readonly class='form-control' value='" + LotesArray[i].Serie + "' id='lote" + i + "'> </div></div> </div>";
            sOptions += "<div class='col-3' hidden> <div class='form-group'> <h5>ItemCode</h5> <div class='controls'> <input type='text' readonly id='producto" + i + "' class='form-control' value='" + LotesArray[i].ItemCode + "'> </div></div> </div> ";



            sOptions += "<div class='col-4'> <div class='form-group'> <h5>Cantidad</h5> <div class='controls'> <input type='number' readonly id='cantidad" + i + "' class='form-control' value='" + LotesArray[i].Cantidad + "'> </div></div> </div> ";


            z++;
        }


        $("#rowLotes2").html(sOptions);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function onChangeMoneda() {
    try {

        var subtotalG = 0;
        var impuestoG = 0;
        var descuentoG = 0;
        var totalG = 0;
        var totalGX = 0;
        var redondeo = 0;

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
            totalGX += ProdCadena[i].TotalLinea;
        }
        $("#subG").text(formatoDecimal(subtotalG.toFixed(2)));
        $("#descG").text(formatoDecimal(descuentoG.toFixed(2)));
        $("#impG").text(formatoDecimal(impuestoG.toFixed(2)));
        var TotalAntesRedondeo = totalG;
        totalG = redondearAl5(totalG, Moneda);
        $("#totG").text(formatoDecimal(totalG.toFixed(2)));


        $("#totGX").text(formatoDecimal(totalGX.toFixed(2)));

        redondeo = totalG - TotalAntesRedondeo;

        $("#redondeo").text(formatoDecimal(redondeo.toFixed(2)));

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
            html += "<option value='" + Clientes[i].id + "' > " + Clientes[i].Codigo + " - " + Clientes[i].Cedula + " - " + Clientes[i].Nombre + " </option>";
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
        var idClientes = $("#ClienteSeleccionado").val();


        $("#ProductoSeleccionado").html(html);

        html += "<option value='0' > Seleccione Producto </option>";

        ProdClientes.sort(function (a, b) {
            // Compara si a y b tienen promoción, y coloca los que tienen promoción primero
            // var PromoenCliente = DetPromociones.find(promo => promo.ItemCode === a.Codigo && promo.idListaPrecio === a.idListaPrecios && promo.idCategoria === a.idCategoria && promo.Cliente == true && promo.ClientesPromociones.filter(detCliente => detCliente.idCliente == idClientes).length > 0 );

            var promoA = DetPromociones.find(promo => promo.ItemCode === a.Codigo && promo.idListaPrecio === a.idListaPrecios && promo.idCategoria === a.idCategoria);

            var promoB = DetPromociones.find(promo => promo.ItemCode === b.Codigo && promo.idListaPrecio === b.idListaPrecios && promo.idCategoria === b.idCategoria);

            if (promoA && !promoB) {
                return -1;
            } else if (!promoA && promoB) {
                return 1;
            } else {
                return 0;
            }
        });

        for (var i = 0; i < ProdClientes.length; i++) {

            var Promo = DetPromociones.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idListaPrecio == ProdClientes[i].idListaPrecios && a.idCategoria == ProdClientes[i].idCategoria && a.Cliente == false);
            var PromoExclusiva = DetPromociones.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idListaPrecio == ProdClientes[i].idListaPrecios && a.idCategoria == ProdClientes[i].idCategoria && a.Cliente == true && a.ClientesPromociones.filter(detCliente => detCliente.idCliente == idClientes).length > 0);

            var Bodegas = Bodega.find(a => a.id == ProdClientes[i].idBodega) == undefined ? undefined : Bodega.find(a => a.id == ProdClientes[i].idBodega);

            if (PromoExclusiva != undefined) {
                html += "<option class='Promo' value='" + ProdClientes[i].id + "' > " + "**PROMO EXCLUSIVA CLIENTE** " + ProdClientes[i].Codigo + " - " + ProdClientes[i].Nombre + " -  Precio: " + formatoDecimal(parseFloat(PromoExclusiva.PrecioFinal).toFixed(2)) + " -  Stock: " + formatoDecimal(parseFloat(ProdClientes[i].Stock).toFixed(2)) + " -  BOD: " + Bodegas.CodSAP + " -  Precio Anterior: " + formatoDecimal(parseFloat(PromoExclusiva.PrecioAnterior).toFixed(2)) + " </option>";

            }
            else if (Promo != undefined) {

                html += "<option class='Promo' value='" + ProdClientes[i].id + "' > " + "**PROMO** " + ProdClientes[i].Codigo + " - " + ProdClientes[i].Nombre + " -  Precio: " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " -  Stock: " + formatoDecimal(parseFloat(ProdClientes[i].Stock).toFixed(2)) + " -  BOD: " + Bodegas.CodSAP + " -  Precio Anterior: " + formatoDecimal(parseFloat(Promo.PrecioAnterior).toFixed(2)) + " </option>";
                //var options = document.querySelectorAll('.select2-results__option');

                //options.forEach(function (option) {
                //    if (option.textContent.includes("**PROMO**")) {
                //        option.style.backgroundColor = 'green';
                //    }
                //});

            } else {
                html += "<option value='" + ProdClientes[i].id + "' > " + ProdClientes[i].Codigo + " - " + ProdClientes[i].Nombre + " -  Precio: " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " -  Stock: " + formatoDecimal(parseFloat(ProdClientes[i].Stock).toFixed(2)) + " -  BOD: " + Bodegas.CodSAP + " </option>";
            }


        }



        $("#ProductoSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function RellenaExoneraciones() {

    try {
        var Producto = Productos.find(a => a.id == $("#ProductoSeleccionado").val());

        var html = "";
        $("#exoneracion").html(html);

        html += "<option value='0' > Seleccione Exoneracion </option>";
        if (ExoneracionesCliente != undefined) {
            for (var i = 0; i < ExoneracionesCliente.length; i++) {

                if (Producto != undefined) {
                    var ProductoExoneracion = ExoneracionesCliente[i].Detalle.filter(a => a.CodCabys == Producto.Cabys);
                    if (ProductoExoneracion.length > 0) {
                        html += "<option value='" + ExoneracionesCliente[i].id + "' selected > " + ExoneracionesCliente[i].NumDoc + " </option>";

                    }
                }

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
        var Grupo = Grupos.find(a => a.id == Cliente.idGrupo);

        var Contado = CP.find(a => a.Nombre == "Contado");
        var Aprobado = Aprobaciones.find(a => a.idCliente == idCliente);


        var contieneContado = Cliente.Nombre.toUpperCase().includes("CONTADO");

        if (contieneContado || Cliente.TipoCedula == "99") {

            $("#selectTD option[value='01']").remove();
        } else {

            if ($("#selectTD option[value='01']").length === 0) {
                $("#selectTD").append('<option value="01">Factura Electrónica</option>');

            }
        }
        if (!contieneContado && Cliente.TipoCedula != "99") {

            $("#selectTD option[value='04']").remove();
        } else {

            if ($("#selectTD option[value='04']").length === 0) {
                $("#selectTD").append('<option value="04">Tiquete Electrónico</option>');


            }
        }
        $("#spanDireccion").text(Cliente.Sennas);
        $("#strongInfo").text("Cédula: " + Cliente.Cedula + " " + "Phone: " + Cliente.Telefono + " " + "  " + " " + "  " + "Email: " + Cliente.Email);
        $("#strongInfo2").text("Grupo: " + Grupo.CodSAP + "-" + Grupo.Nombre + "  " + "Saldo: " + formatoDecimal(Cliente.Saldo.toFixed(2)) + " " + "  " + " " + "  " + "Limite Credito: " + formatoDecimal(Cliente.LimiteCredito.toFixed(2)));
        $("#strongInfo3").text("Días gracia: " + formatoDecimal(Cliente.DiasGracia.toFixed(0)) + " " + "  " + " " + "  " + "Monto Extra: " + formatoDecimal(Cliente.MontoExtra.toFixed(2)));
        if (((Cliente.LimiteCredito + Cliente.MontoExtra) - Cliente.Saldo) <= 0 && Cliente.idCondicionPago != Contado.id && Aprobado == undefined) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                html: 'Limite de crédito excedido' +
                    '<br><button id="solicitarCreditoBtn" class="swal2-confirm swal2-styled" onclick="Solicitar()">Solicitar Crédito</button>'

            })
        }

        RecolectarFacturas();

        ProdClientes = Productos.filter(a => a.idListaPrecios == Sucursal.idListaPrecios);
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
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }


}

function RecolectarFacturas() {
    try {
        var idClientes = $("#ClienteSeleccionado").val();
        var Cliente = Clientes.find(a => a.id == idClientes);
        var Aprobado = Aprobaciones.find(a => a.idCliente == idClientes);
        var CondP = CP.filter(a => a.id == Cliente.idCondicionPago);

        var Contado = CP.find(a => a.Nombre == "Contado");

        if (Aprobado) {
            FP = true;
        } else if (Cliente.idCondicionPago == Contado.id) {
            FP = false;
        }

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: $("#urlFacturas").val(),
            data: { idCliente: idClientes },
            success: function (result) {
                if (Aprobado == undefined) {
                    if (result == null) {

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ha ocurrido un error al intentar recuperar facturas'

                        })

                    } else if (result.length > 0) {
                        console.log(result);
                        // $("#selectCondPago").attr("disabled", "disabled");
                        FP = false;

                        var textoF = "";
                        for (var i = 0; i < result.length; i++) {
                            textoF += " " + result[i].docNum + ", ";
                        }

                        Swal.fire({
                            icon: 'warning',
                            title: 'Advertencia...',
                            html: 'El Cliente tiene las siguientes facturas pendientes: ' + textoF + " por lo tanto se bloquea el crédito" +
                                '<br><button id="solicitarCreditoBtn" class="swal2-confirm swal2-styled" onclick="Solicitar()">Solicitar Crédito</button>'

                        })
                    } else {
                        if (((Cliente.LimiteCredito + Cliente.MontoExtra) - Cliente.Saldo) <= 0 && Cliente.idCondicionPago != Contado.id) {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Advertencia',
                                html: 'Limite de crédito excedido' +
                                    '<br><button id="solicitarCreditoBtn" class="swal2-confirm swal2-styled" onclick="Solicitar()">Solicitar Crédito</button>'

                            })
                        } else if (((Cliente.LimiteCredito + Cliente.MontoExtra) - Cliente.Saldo) > 0) {
                            FP = true;
                            //$("#selectCondPago").attr("disabled", false);
                        }

                    }
                }
                if (CondP.length > 0 && FP == true) {
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
function RellenaCondiciones(CPS) {
    try {
        var idClientes = $("#ClienteSeleccionado").val();
        var Cliente = Clientes.find(a => a.id == idClientes).Nombre;
        var Name = Cliente.includes("CONTADO");
        var Clientex = Clientes.find(a => a.id == idClientes);

        var valorCondicion = Oferta != null || Oferta != undefined ? Oferta.idCondPago : 0;
        var text = "";
        $("#selectCondPago").html(text);

        var Contado = CP.find(a => a.Nombre == "Contado");
        var Transito = CP.find(a => a.Nombre == "Transito");
        var CondP = CP.filter(a => a.id == Cliente.idCondicionPago);



        if (Clientex.Transitorio) {
            text += "<option value='" + Contado.id + "'> " + Contado.Nombre + " </option>";
            if ( !Name) {
                text += "<option value='" + Transito.id + "'> " + Transito.Nombre + " </option>";
            }

        } else {
            text += "<option value='" + Contado.id + "'> " + Contado.Nombre + " </option>";

        }
        if (Clientex.CxC == 0) {
            for (var i = 0; i < CPS.length; i++) {
                if (CPS[i].id != Contado.id && FP == true) {
                    // Verificar si la condición de pago no es "Transito"
                    if (CPS[i].id !== Transito.id && FP == true) {
                        if (valorCondicion == CPS[i].id && FP == true) {
                            text += "<option selected value='" + CPS[i].id + "'> " + CPS[i].Nombre + " </option>";
                        } else {
                            text += "<option value='" + CPS[i].id + "'> " + CPS[i].Nombre + " </option>";
                        }
                    }
                }
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                html: 'Crédito Bloqueado por CxC'


            })
        }

        $("#selectCondPago").html(text);

        if (Inicio == true) {
            $("#selectCondPago").val(Oferta.idCondPago);
            Inicio = false;
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }
}

function Solicitar() {
    try {
        var AprobacionesCreditos =
        {
            id: 0,


            idCliente: $("#ClienteSeleccionado").val(),
            FechaCreacion: $("#Fecha").val(),
            idUsuarioCreador: 0,
            idUsuarioCreador: 0,
            Status: "P",
            Activo: true,
            Total: 0,
            TotalAprobado: 0

        };

        if (AprobacionesCreditos != undefined) {
            Swal.fire({
                title: '¿Desea guardar la solicitud de crédito de este cliente?',
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

                    var recibidos = JSON.stringify(AprobacionesCreditos);

                    $.ajax({
                        type: 'POST',

                        url: $("#urlAprobacion").val(),
                        dataType: 'json',
                        data: { recibidos: AprobacionesCreditos },
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.aprobacionesCreditos);
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




                                    }
                                })

                            } else {

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.aprobacionesCreditos

                                })
                            }
                        },

                        beforeSend: function (xhr) {


                        },
                        complete: function () {

                        },
                        error: function (error) {

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
            text: 'Ha ocurrido un error al intentar hacer la solicitud:  ' + e

        })
    }
}
function ExoneracionxCliente() {
    try {
        var idCliente = $("#ClienteSeleccionado").val();
        ExoneracionesCliente = Exoneraciones.filter(a => a.idCliente == idCliente && a.Activo == true);

        RellenaExoneraciones();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e

        })
    }

}

function onChangeProducto() {
    try {
        var idProducto = $("#ProductoSeleccionado").val();

        var Producto = ProdClientes.find(a => a.id == idProducto);

        var idCliente = $("#ClienteSeleccionado").val();
        var Cliente = Clientes.find(a => a.id == idCliente);
     

        if (Producto != undefined) {
            var Categoria = Categorias.find(a => a.id == Producto.idCategoria);
            var PromoExclusiva = DetPromociones.find(a => a.ItemCode == Producto.Codigo && a.idListaPrecio == Producto.idListaPrecios && a.idCategoria == Producto.idCategoria && a.Cliente == true && a.ClientesPromociones.filter(detCliente => detCliente.idCliente == idCliente).length > 0);

            $("#inputPrecio").val(parseFloat((PromoExclusiva != undefined ? PromoExclusiva.PrecioFinal : Producto.PrecioUnitario)));
            $("#inputCabys").val(Producto.Cabys);
            $("#inputCategoria").val(Categoria.id + " - " + Categoria.Nombre);
            $("#inputNomPro").val(Producto.Nombre);
            if (Producto.Editable == true) {
                $("#inputNomPro").attr("disabled", false);
            } else {
                $("#inputNomPro").attr("disabled", true);
            }
         
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
            $("#inputCategoria").val("");
            $("#inputNomPro").val("");
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
    try {
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
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }


}

function RellenaCantones(ListCantones) {
    try {
        var sOptions = '';

        $("#selectC").html('');

        for (var i = 0; i < ListCantones.length; i++) {

            sOptions += '<option value="' + ListCantones[i].CodCanton + '">' + ListCantones[i].NomCanton + '</option>';

        }
        $("#selectC").html(sOptions);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function RellenaDistritos(ListDistritos) {
    try {
        var sOptions = '';

        $("#selectD").html('');

        for (var i = 0; i < ListDistritos.length; i++) {

            sOptions += '<option value="' + ListDistritos[i].CodDistrito + '">' + ListDistritos[i].NomDistrito + '</option>';

        }
        $("#selectD").html(sOptions);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function RellenaBarrios(ListBarrios) {
    try {
        var sOptions = '';

        $("#selectB").html('');

        for (var i = 0; i < ListBarrios.length; i++) {

            sOptions += '<option value="' + ListBarrios[i].CodBarrio + '">' + ListBarrios[i].NomBarrio + '</option>';

        }
        $("#selectB").html(sOptions);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function AbrirModalAgregarCliente() {
    try {
        $("#ModalAgregarCliente").modal("show");
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}
function esCorreoValido(email) {
    try {
        return email.includes("@") && email.includes(".");
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

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


        } else if (cliente.Email == "" || cliente.Email == null || !validarCorreo(cliente.Email)) {
            return false;

        } else if (cliente.Telefono == "" || cliente.Telefono == null) {
            return false;

        } else if (cliente.Sennas == "" || cliente.Sennas == null) {
            return false;

        } else if (cliente.CorreoPublicitario == "" || cliente.CorreoPublicitario == null) {
            return false;

        } else if (cliente.idGrupo == "" || cliente.idGrupo == null || cliente.idGrupo == 0) {
            return false;
        }
        else if (cliente.TipoCedula == "02" && cliente.Cedula.length < 10) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error, la cédula juridica debe tener 10 caracteres'

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
            text: 'Error ' + e

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
        $("#DV").val("");
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

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
            LimiteCredito: 0,
            Activo: true,
            ProcesadoSAP: false,
            idCondicionPago: 0,
            DV: $("#DV").val(),
            MontoExtra: 0,
            DiasGracia: 0
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
                                            LimiteCredito: json.cliente.limiteCredito,
                                            Activo: true,
                                            ProcesadoSAP: false,
                                            idCondicionPago: 0,
                                            DV: json.cliente.dV,
                                            MontoExtra: 0,
                                            DiasGracia: 0
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
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.cliente

                                })
                            }
                        },

                        beforeSend: function (xhr) {


                        },
                        complete: function () {

                        },
                        error: function (error) {

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
            var PE = Productos.find(a => a.id == ProdCadena[i].idProducto);
            var TotalGanancia = (ProdCadena[i].TotalLinea - ProdCadena[i].TotalImpuesto);
            var MonedaDoc = $("#selectMoneda").val();
            var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
            html += "<tr>";

            html += "<td> " + (i + 1) + " </td>";

            html += "<td > " + ProdCadena[i].Descripcion + " </td>";
            if (Empresa == "G") {
                html += "<td > " + ProdCadena[i].Localizacion + " </td>";
            }
            html += "<td class='text-center'> <input onchange='javascript: onChangeCantidadProducto(" + i + ")' type='number' id='" + i + "_Prod' class='form-control'   value= '" + formatoDecimal(parseFloat(ProdCadena[i].Cantidad).toFixed(2)) + "' min='1'/>  </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangePrecioProducto(" + i + ")' type='number' id='" + i + "_Prod3' class='form-control'   value= '" + parseFloat(ProdCadena[i].PrecioUnitario).toFixed(2) + "' min='1'/> </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeDescuentoProducto(" + i + ")' type='number' id='" + i + "_Prod2' class='form-control'   value= '" + formatoDecimal(parseFloat(ProdCadena[i].PorDescto).toFixed(2)) + "' min='1'/>  </td>";
           
            if ($("#ParamPrecioDescuento").val() == "true") {
                html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PrecioUnitario - (ProdCadena[i].Descuento / ProdCadena[i].Cantidad)).toFixed(2)) + " </td>";
            } else {
                html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].Descuento).toFixed(2)) + " </td>";
            }
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].TotalImpuesto / ProdCadena[i].Cantidad).toFixed(2)) + " </td>";
            if (Empresa == "N") {

                html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PorExoneracion).toFixed(2)) + " </td>";
            }
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].TotalLinea).toFixed(2)) + " </td>";
            if ($("#RolGanancia").val() == "value") {
                if (ProdCadena[i].Moneda != MonedaDoc) {
                    if (ProdCadena[i].Moneda != "CRC") {
                        var Costo = ProdCadena[i].Costo * ProdCadena[i].Cantidad;
                        if (retornaMargenGanancia(TotalGanancia, Costo) > 0) {
                            html += "<td class='text-right' style='background-color:  #EFFFE9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                        else {
                            html += "<td class='text-right' style='background-color:#FFE9E9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }

                    } else {
                        var Costo = (ProdCadena[i].Costo / TipodeCambio.TipoCambio) * ProdCadena[i].Cantidad;
                        if (retornaMargenGanancia(TotalGanancia, Costo) > 0) {
                            html += "<td class='text-right' style='background-color:  #EFFFE9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        } else {
                            html += "<td class='text-right' style='background-color:#FFE9E9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                    }

                }
                else {
                    if (ProdCadena[i].Moneda != "CRC") {
                        var Costo = (ProdCadena[i].Costo / TipodeCambio.TipoCambio) * ProdCadena[i].Cantidad;
                        if (retornaMargenGanancia(TotalGanancia, Costo) > 0) {
                            html += "<td class='text-right' style='background-color:  #EFFFE9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                        else {
                            html += "<td class='text-right' style='background-color:#FFE9E9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                    } else {
                        var Costo = ProdCadena[i].Costo * ProdCadena[i].Cantidad;
                        if (retornaMargenGanancia(TotalGanancia, Costo) > 0) {
                            html += "<td class='text-right' style='background-color:  #EFFFE9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                        else {
                            html += "<td class='text-right' style='background-color:#FFE9E9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                    }
                }
                ValidarCosto();
            }
            html += "<td class='text-center'> <a class='fa fa-trash' onclick='javascript:EliminarProducto(" + i + ") '> </a> </td>";

         
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
function cantidadRepetidos(palabra, separador) {

    try {
        return palabra.split(separador).length - 1;
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

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
            text: 'Error ' + e

        })
    }

}

function ValidarCosto() {
    try {
        var totalC = 0;
        for (var i = 0; i < ProdCadena.length; i++) {
            var Produc = Productos.find(a => a.id == ProdCadena[i].idProducto);

            totalC += ProdCadena[i].Costo * ProdCadena[i].Cantidad;




        }
        var subtotalG = parseFloat(ReplaceLetra($("#subG").text()));
        var descuentoG = parseFloat(ReplaceLetra($("#descG").text()));
        var subtotalD = subtotalG - descuentoG;
        var diferencia = subtotalD - totalC;
        var TotalGanancia = (diferencia / subtotalD) * 100;

        $("#totGana").text(TotalGanancia.toFixed(2));

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}
function AgregarProductoTabla() {
    try {
        var subtotalG = parseFloat(ReplaceLetra($("#subG").text()));
        var impuestoG = parseFloat(ReplaceLetra($("#impG").text()));
        var descuentoG = parseFloat(ReplaceLetra($("#descG").text()));
        var totalG = parseFloat(ReplaceLetra($("#totG").text()));
        var totalGX = parseFloat(ReplaceLetra($("#totGX").text()));
        var redondeo = parseFloat(ReplaceLetra($("#redondeo").text()));

        var id = $("#ProductoSeleccionado").val();
        var id = $("#ProductoSeleccionado").val();
        var PE = ProdClientes.find(a => a.id == id);
        var Moneda = $("#selectMoneda").val();




        var Producto =
        {
            idEncabezado: 0,
            Descripcion: PE.Codigo + " - " + $("#inputNomPro").val(),
            idProducto: PE.id,
            Moneda: PE.Moneda,
            NumLinea: 0,
            Cantidad: parseFloat($("#cantidad").val()),
            TotalImpuesto: 0,
            PrecioUnitario: parseFloat($("#inputPrecio").val()),
            PorDescto: parseFloat($("#descuento").val()),
            Descuento: 0,
            TotalLinea: 0,
            Cabys: $("#inputCabys").val(),
            idExoneracion: $("#exoneracion").val(),
            NomPro: $("#inputNomPro").val(),
            PorExoneracion: 0,
            Costo: PE.Costo,
            PrecioMin: 0,
            MargenMin: 0,
            Localizacion: PE.Localizacion


        };

        var Descuento = parseFloat($("#DES").val());
        var LotesArray = LotesCadena.filter(a => a.ItemCode == PE.Codigo);
        var cantidad = parseInt($("#cantidad").val());
        var Promo = DetPromociones.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Cliente == 0);
        var DetMargen = DetMargenes.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Moneda == PE.Moneda);
        var Margen = Margenes.find(a => a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Moneda == PE.Moneda);
        var PrecioMin = 0;
        var MargenMin = 0;
        var idClientes = $("#ClienteSeleccionado").val();
        var Cliente = Clientes.find(a => a.id == idClientes);
        var DescuentoCliente = Cliente.Descuento / 100;

        if (DetMargen != undefined) {
            PrecioMin = DetMargen.PrecioMin;
            MargenMin = DetMargen.MargenMin;

            if (DescuentoCliente > 0) {
                var PrecioCob = PE.Costo / (1 - (Margen.Cobertura / 100));
                Producto.MargenMin = MargenMin - (MargenMin * DescuentoCliente);

                var MargenNuevo = Producto.MargenMin / 100;

                Producto.PrecioMin = PrecioCob / (1 - MargenNuevo);
            } else {
                Producto.MargenMin = MargenMin;
                Producto.PrecioMin = PrecioMin;
            }

        } else if (Margen != undefined) {
            var PrecioCob = PE.Costo / (1 - (Margen.Cobertura / 100));
            PrecioMin = PrecioCob / (1 - (Margen.MargenMin / 100));
            MargenMin = Margen.MargenMin;

            if (DescuentoCliente > 0) {
                var PrecioCob = PE.Costo / (1 - (Margen.Cobertura / 100));
                Producto.MargenMin = MargenMin - (MargenMin * DescuentoCliente);

                var MargenNuevo = Producto.MargenMin / 100;

                Producto.PrecioMin = PrecioCob / (1 - MargenNuevo);
            } else {
                Producto.MargenMin = MargenMin;
                Producto.PrecioMin = PrecioMin;
            }


        }


        var cantidades = 0;

        for (var i = 0; i < LotesArray.length; i++) {
            cantidades += parseInt(LotesArray[i].Cantidad);
        }


        for (var i = 0; i < ProdCadena.length; i++) {


            if (PE.id == ProdCadena[i].idProducto && PE.Editable == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ya se ingreso el mismo producto en otra línea, si necesita mas unidades actualiza la cantidad en la linea ' + ' ' + (ProdCadena[i].NumLinea + 1)

                })
                Duplicado = true;
                return false;
            } else {
                Duplicado = false;
            }
        }


        var PromoExclusiva = DetPromociones.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Cliente == true && a.ClientesPromociones.filter(detCliente => detCliente.idCliente == idClientes).length > 0);



        if (PE.PrecioUnitario > Producto.PrecioUnitario && PE.Editable == false && PromoExclusiva == undefined) {


            throw new Error('Precio invalido, el precio tiene que ser mayor o igual a ' + ' ' + PE.PrecioUnitario);


        }
        if (PromoExclusiva != undefined) {
            if (PromoExclusiva.PrecioFinal > Producto.PrecioUnitario && PE.Editable == false) {

                throw new Error('Precio invalido, el precio tiene que ser mayor o igual a ' + ' ' + PromoExclusiva.PrecioFinal);
            }
        }


        if (Producto.PrecioUnitario <= 0 && PE.Editable == true) {


            throw new Error('Precio invalido, el precio tiene que ser mayor  a 0');
        }
        if (Producto.Cantidad <= 0) {

            throw new Error('Cantidad Invalida');

        }
        if (Producto.PorDescto < 0) {

            throw new Error('Descuento Invalido');

        }

        if ((Promo != undefined || PromoExclusiva != undefined) && Producto.PorDescto > 0) {

            throw new Error('No se puede aplicar más descuentos, el Producto ' + Producto.Descripcion + ' ya tiene una Promoción');
        }
        var DescuentoMaximo = ((Producto.PrecioUnitario - Producto.PrecioMin) / Producto.PrecioUnitario) * 100;
        var DescuentoX = Producto.PrecioUnitario * (Producto.PorDescto / 100);
        var PrecioFinal = Producto.PrecioUnitario - DescuentoX;

        if (Producto.PrecioMin > PrecioFinal && Promo == undefined && PromoExclusiva == undefined) {

            throw new Error('No se puede aplicar el descuento debido a que es menor al Precio Minimo, el Producto ' + Producto.Descripcion + ' lo maximo que se le puede aplicar de Descuento es de ' + parseFloat(DescuentoMaximo).toFixed(2) + '%');

        }
        if (Producto.PorDescto > Descuento) {

            throw new Error('Usted no puede aplicar este descuento, el descuento máximo asignado a su usuario es de' + ' ' + parseFloat(Descuento).toFixed(2) + '%');

        }

        if (Producto.PrecioUnitario <= 0) {

            throw new Error('No se puede agregar un producto con Precio 0');

        }
        //else if (((Promo != undefined && Producto.PorDescto == 0) || (Promo == undefined)) && ((Producto.PrecioMin <= PrecioFinal) || (Promo != undefined)) && ((PE.Serie == true && Producto.NumSerie != "0") || (PE.Serie == false)) && Duplicado == false && Producto.Cantidad > 0 && Producto.PorDescto >= 0 && Producto.PorDescto <= Descuento && (PE.PrecioUnitario <= Producto.PrecioUnitario || PromoExclusiva != undefined) || (PE.Editable == true && Producto.Cantidad > 0 && Producto.PrecioUnitario > 0) && Producto.PrecioUnitario > 0)
        //{

        if (Producto.Cabys.length >= 13 || Pais == "P") {


            var ImpuestoTarifa = $("#impuesto").val();
            var IMP = Impuestos.find(a => a.id == ImpuestoTarifa);

            var calculoIMP = IMP.Tarifa;

            Producto.Descuento = (Producto.Cantidad * Producto.PrecioUnitario) * (Producto.PorDescto / 100);
            Producto.TotalImpuesto = ((Producto.Cantidad * Producto.PrecioUnitario) - Producto.Descuento) * (calculoIMP / 100);
            //EX => Exoneracion
            var EX = Exoneraciones.find(a => a.id == Producto.idExoneracion);
            if (EX != undefined) {
                if ((13 - EX.PorExon) < calculoIMP) {

                    var ValorExonerado = (EX.PorExon / 100);
                    var TarifaExonerado = ((Producto.Cantidad * Producto.PrecioUnitario) - Producto.Descuento) * ValorExonerado;
                    Producto.TotalImpuesto -= TarifaExonerado;
                    Producto.PorExoneracion = EX.PorExon;
                }
            }
            //Termina Exoneracion


            Producto.TotalLinea = (Producto.Cantidad * Producto.PrecioUnitario) - Producto.Descuento + Producto.TotalImpuesto;

            subtotalG += (Producto.Cantidad * Producto.PrecioUnitario);
            impuestoG += Producto.TotalImpuesto;
            descuentoG += Producto.Descuento;
            totalG += Producto.TotalLinea;
            totalGX += Producto.TotalLinea;

            $("#subG").text(formatoDecimal(subtotalG.toFixed(2)));
            $("#descG").text(formatoDecimal(descuentoG.toFixed(2)));
            $("#impG").text(formatoDecimal(impuestoG.toFixed(2)));

            //Poner validacion $
            var TotalAntesRedondeo = totalG;
            totalG = redondearAl5(totalG, Moneda);
            $("#totG").text(formatoDecimal(totalG.toFixed(2)));
            $("#totGX").text(formatoDecimal(totalGX.toFixed(2)));
            redondeo = totalG - TotalAntesRedondeo;

            $("#redondeo").text(formatoDecimal(redondeo.toFixed(2)));

            ProdCadena.push(Producto);

            RellenaTabla();
            onChangeMoneda();

            $("#ProductoSeleccionado").val("0").trigger('change.select2');
            $("#SerieSeleccionado").val("0").trigger('change.select2');
            $("#exoneracion").val("0").trigger('change.select2');
        } else {

            throw new Error('Producto sin Cabys valido');

        }

        var Exon = ProdCadena.find(a => a.PorExoneracion > 0);
        var Desc = ProdCadena.find(a => a.PorDescto > 0);
        if (ProdCadena.length > 0 && (Exon != undefined || Desc != undefined)) {

            $('#ClienteSeleccionado').prop('disabled', true);

        } else {
            $('#selectMoneda').prop('disabled', false);
            $('#ClienteSeleccionado').prop('disabled', false);

        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        })
    }








}

function EliminarProducto(i) {

    var Producto = ProdCadena[i];
    var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);
    var Moneda = $("#selectMoneda").val();

    var subtotalG = parseFloat(ReplaceLetra($("#subG").text()));
    var impuestoG = parseFloat(ReplaceLetra($("#impG").text()));
    var descuentoG = parseFloat(ReplaceLetra($("#descG").text()));
    var totalG = parseFloat(ReplaceLetra($("#totG").text()));
    var totalGX = parseFloat(ReplaceLetra($("#totGX").text()));
    var redondeo = parseFloat(ReplaceLetra($("#redondeo").text()));

    subtotalG -= (Producto.Cantidad * Producto.PrecioUnitario);
    impuestoG -= Producto.TotalImpuesto;
    descuentoG -= Producto.Descuento;
    totalG -= Producto.TotalLinea;
    totalGX -= Producto.TotalLinea;
    redondeo -= Producto.TotalLinea;
    $("#subG").text(formatoDecimal(subtotalG.toFixed(2)));
    $("#descG").text(formatoDecimal(descuentoG.toFixed(2)));
    $("#impG").text(formatoDecimal(impuestoG.toFixed(2)));

    var TotalAntesRedondeo = totalG;
    totalG = redondearAl5(totalG, Moneda);
    $("#totG").text(formatoDecimal(totalG.toFixed(2)));
    $("#totGX").text(formatoDecimal(totalGX.toFixed(2)));
    redondeo = totalG - TotalAntesRedondeo;

    $("#redondeo").text(formatoDecimal(redondeo.toFixed(2)));
    ProdCadena.splice(i, 1);
    var Lotes2 = LotesCadena.filter(a => a.ItemCode == PE.Codigo);

    for (var x = 0; x < Lotes2.length; x++) {

        LotesCadena.splice(LotesCadena.indexOf(LotesCadena.find(a => a.ItemCode == PE.Codigo)), 1);

    }
    var Exon = ProdCadena.find(a => a.PorExoneracion > 0);
    var Desc = ProdCadena.find(a => a.PorDescto > 0);
    if (ProdCadena.length > 0 && (Exon != undefined || Desc != undefined)) {

        $('#ClienteSeleccionado').prop('disabled', true);

    } else {
        $('#selectMoneda').prop('disabled', false);
        $('#ClienteSeleccionado').prop('disabled', false);

    }
    RellenaTabla();
}

//Generar
function Generar() {
    try {


        var EncOferta = {
            id: $("#id").val(),
            idCliente: $("#ClienteSeleccionado").val(),
            idVendedor: $("#selectVendedor").val(),
            idUsuarioCreador: 0,
            Fecha: $("#Fecha").val(),
            FechaVencimiento: $("#fechaVencimiento").val(),
            Comentarios: $("#inputComentarios").val(),
            Subtotal: parseFloat(ReplaceLetra($("#subG").text())),
            TotalImpuestos: parseFloat(ReplaceLetra($("#impG").text())),
            TotalDescuento: parseFloat(ReplaceLetra($("#descG").text())),
            TotalCompra: parseFloat(ReplaceLetra($("#totGX").text())),
            Redondeo: parseFloat(ReplaceLetra($("#redondeo").text())),
            PorDescto: parseFloat(ReplaceLetra($("#descuento").val())),
            CodSuc: "",
            Moneda: $("#selectMoneda").val(),
            idCondPago: $("#selectCondPago").val(),
            TipoDocumento: $("#selectTD").val(),
            Detalle: ProdCadena,
            Lotes: LotesCadena
        }

        if (validarOferta(EncOferta)) {
            Swal.fire({
                title: '¿Desea editar la proforma?',
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
                    var jsonString = JSON.stringify(EncOferta);
                    // Comprimir la cadena JSON utilizando gzip
                    var compressedData = pako.gzip(jsonString);

                    // Convertir los datos comprimidos a un ArrayBuffer (opcional, depende de tu caso de uso)
                    var compressedArrayBuffer = compressedData.buffer;


                    $.ajax({
                        type: 'POST',

                        url: $("#urlGenerar").val(),
                        dataType: 'json',
                        contentType: 'application/json',
                        data: compressedArrayBuffer,
                        processData: false,
                        headers: {
                            RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
                        },
                        success: function (json) {


                            console.log("resultado " + json.oferta);
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

                                        window.location.href = window.location.href.split("/Editar")[0];


                                    }
                                })

                            } else {

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.Oferta

                                })
                            }
                        },

                        beforeSend: function (xhr) {
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
//

function validarOferta(e) {
    try {
        var Contado = CP.find(a => a.Nombre == "Contado");
        var Transito = CP.find(a => a.Nombre == "Transito");
        var idCliente = $("#ClienteSeleccionado").val();
        var totalG = parseFloat(ReplaceLetra($("#totG").text()));
        var totalGX = parseFloat(ReplaceLetra($("#totGX").text()));
        var redondeo = parseFloat(ReplaceLetra($("#redondeo").text()));
        var Cliente = Clientes.find(a => a.id == idCliente);
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var CondPago = $("#selectCondPago").val();
        var Aprobado = Aprobaciones.find(a => a.idCliente == idCliente);

        if ($("#selectMoneda").val() != "CRC") {
            totalG = totalG * TipodeCambio.TipoCambio;
            redondeo = redondeo * TipodeCambio.TipoCambio;
            totalGX = totalGX * TipodeCambio.TipoCambio;
        }
        if ($("#selectCondPago").val() == Contado.id) {
            if (e.idCliente == "0" || e.idCliente == null) {
                return false;
            }
            if (e.idCliente == "0" || e.idCliente == null) {
                return false;
            } else if (e.FechaVencimiento == "" || e.FechaVencimiento == null) {
                return false;
            }
            else if (e.Detalle.length == 0 || e.Detalle == null) {
                return false;
            }
            if (e.idVendedor == "0" || e.idVendedor == null) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error al intentar agregar, falta el vendedor '

                })
                return false;


            }
            if (e.idCondPago == "0" || e.idCondPago == null) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error al intentar agregar, falta el la condición de pago'

                })
                return false;


            }


            else {
                return true;
            }
        } if (((Cliente.LimiteCredito + Cliente.MontoExtra) - - Cliente.Saldo) < totalG && CondPago != Contado.id && CondPago != Transito.id && Aprobado == undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El total de la factura es mayor al Limite de crédito'

            })
            return false;
        }
        if (e.idVendedor == "0" || e.idVendedor == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: 'El total de la factura es mayor al Limite de crédito' +
                    '<br><button id="solicitarCreditoBtn" class="swal2-confirm swal2-styled" onclick="Solicitar()">Solicitar Crédito</button>'


            })
            return false;


        }
        if (Aprobado != undefined) {
            if (Aprobado.Total < totalG && CondPago != Contado.id && CondPago != Transito.id) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El total de la factura es mayor al crédito aprobado en la solicitud, el cual el monto es de ' + parseFloat(Aprobado.Total).toFixed(2)

                })
                return false;

            } else {
                return true;
            }

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
function onChangeDescuentoProducto(i) {
    try {
        ProdCadena[i].PorDescto = parseFloat($("#" + i + "_Prod2").val()).toFixed(2);
        var Descuento = parseFloat($("#DES").val());
        var idClientes = $("#ClienteSeleccionado").val();

        var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);
        var Promo = DetPromociones.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Cliente == 0);
        var PromoExclusiva = DetPromociones.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Cliente == true && a.ClientesPromociones.filter(detCliente => detCliente.idCliente == idClientes).length > 0);
        var Moneda = $("#selectMoneda").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        if (Moneda != "USD") {
            var DescuentoMaximo = ((ProdCadena[i].PrecioUnitario - ProdCadena[i].PrecioMin) / ProdCadena[i].PrecioUnitario) * 100;
        } else {
            var DescuentoMaximo = ((ProdCadena[i].PrecioUnitario - (ProdCadena[i].PrecioMin / TipodeCambio.TipoCambio)) / ProdCadena[i].PrecioUnitario) * 100;
        }
        var DescuentoX = ProdCadena[i].PrecioUnitario * (ProdCadena[i].PorDescto / 100);
        var PrecioFinal = ProdCadena[i].PrecioUnitario - DescuentoX;
        DescuentoX = parseFloat(DescuentoX.toFixed(2));
        PrecioFinal = parseFloat(PrecioFinal.toFixed(2));

        if (ProdCadena[i].PorDescto >= 0 && ProdCadena[i].PorDescto <= Descuento && Promo == undefined && ((ProdCadena[i].PrecioMin <= PrecioFinal && Moneda == "CRC") || (ProdCadena[i].PrecioMin / TipodeCambio.TipoCambio <= PrecioFinal && Moneda == "USD"))) {
            ValidarTotales();
        }

        if (ProdCadena[i].PorDescto < 0) {
            ProdCadena[i].PorDescto = 0;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Descuento Invalido'

            })

            ValidarTotales();
            ValidarCosto();
        }
        if ((Promo != undefined || PromoExclusiva != undefined) && Producto.PorDescto > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se puede aplicar más descuentos, el Producto ' + ProdCadena[i].Descripcion + ' ya tiene una Promoción'

            })
            ProdCadena[i].PorDescto = 0;
            ValidarTotales();
            ValidarCosto();
        }

        if (ProdCadena[i].PorDescto > Descuento) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Usted no puede aplicar este descuento, el descuento máximo asignado a su usuario es de' + ' ' + parseFloat(Descuento).toFixed(2) + '%'

            })
            ProdCadena[i].PorDescto = 0;
            ValidarTotales();
            ValidarCosto();
        }
        if (Moneda != "USD") {
            if (ProdCadena[i].PrecioMin > PrecioFinal) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se puede aplicar el descuento debido a que es menor al Precio Minimo, el Producto ' + ProdCadena[i].Descripcion + ' lo maximo que se le puede aplicar de Descuento es de ' + parseFloat(DescuentoMaximo).toFixed(2) + '%'

                })
                ProdCadena[i].PorDescto = 0;
                ValidarTotales();
                ValidarCosto();
            }

        } else {
            if ((ProdCadena[i].PrecioMin / TipodeCambio.TipoCambio) > PrecioFinal) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se puede aplicar el descuento debido a que es menor al Precio Minimo, el Producto ' + ProdCadena[i].Descripcion + ' lo maximo que se le puede aplicar de Descuento es de ' + parseFloat(DescuentoMaximo).toFixed(2) + '%'

                })
                ProdCadena[i].PorDescto = 0;
                ValidarTotales();
                ValidarCosto();
            }
        }
        var Exon = ProdCadena.find(a => a.PorExoneracion > 0);
        var Desc = ProdCadena.find(a => a.PorDescto > 0);
        if (ProdCadena.length > 0 && (Exon != undefined || Desc != undefined)) {

            $('#ClienteSeleccionado').prop('disabled', true);

        } else {
            $('#selectMoneda').prop('disabled', false);
            $('#ClienteSeleccionado').prop('disabled', false);

        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}

function Setear() {
    try {

        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var Moneda = $("#selectMoneda").val();


        for (var i = 0; i < ProdCadena.length; i++) {


            var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);

            var Promo = DetPromociones.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria);

            var DescuentoMaximoX = 0;
            if (Moneda != "USD") {
                DescuentoMaximoX = ((ProdCadena[i].PrecioUnitario - ProdCadena[i].PrecioMin) / ProdCadena[i].PrecioUnitario) * 100;
            } else {
                DescuentoMaximoX = ((ProdCadena[i].PrecioUnitario - (ProdCadena[i].PrecioMin / TipodeCambio.TipoCambio)) / ProdCadena[i].PrecioUnitario) * 100;
            }
            var DescuentoMaximo = Math.floor(DescuentoMaximoX * 100) / 100;
            var Descuento = ProdCadena[i].PrecioUnitario * (ProdCadena[i].PorDescto / 100);
            var PrecioFinal = ProdCadena[i].PrecioUnitario - Descuento;
            ProdCadena[i].PorDescto = DescuentoMaximo;
            parseFloat($("#" + i + "_Prod2").val(DescuentoMaximo)).toFixed(2);
            onChangeDescuentoProducto(i);
        }



    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar   ' + e

        })
    }
}
function onChangePrecioProducto(i) {
    try {

        var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);
        var Moneda = $("#selectMoneda").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var idClientes = $("#ClienteSeleccionado").val();
        ProdCadena[i].PrecioUnitario = parseFloat($("#" + i + "_Prod3").val()).toFixed(2);
        var PromoExclusiva = DetPromociones.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Cliente == true && a.ClientesPromociones.filter(detCliente => detCliente.idCliente == idClientes).length > 0);


        if (((ProdCadena[i].PrecioUnitario >= PE.PrecioUnitario && Moneda == "CRC") || ((Pais == "C" ? ProdCadena[i].PrecioUnitario >= PE.PrecioUnitario / TipodeCambio.TipoCambio : ProdCadena[i].PrecioUnitario >= PE.PrecioUnitario) && Moneda == "USD")) || (PE.Editable == true && ProdCadena[i].PrecioUnitario > 0)) {
            ValidarTotales();
            ValidarCosto();
        }

        else if (PE.PrecioUnitario > ProdCadena[i].PrecioUnitario && PE.Editable == false && Moneda == "CRC" && PromoExclusiva == undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor o igual a ' + ' ' + PE.PrecioUnitario

            })
            ProdCadena[i].PrecioUnitario = PE.PrecioUnitario;
            ValidarTotales();
            ValidarCosto();

        } else if ((Pais == "C" ? (PE.PrecioUnitario / TipodeCambio.TipoCambio) > ProdCadena[i].PrecioUnitario : (PE.PrecioUnitario) > ProdCadena[i].PrecioUnitario) && PE.Editable == false && Moneda == "USD" && PromoExclusiva == undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor o igual a ' + ' ' + (Pais == "C" ? (PE.PrecioUnitario / TipodeCambio.TipoCambio) : PE.PrecioUnitario)

            })
            ProdCadena[i].PrecioUnitario = (Pais == "C" ? PE.PrecioUnitario / TipodeCambio.TipoCambio : PE.PrecioUnitario);
            ValidarTotales();
            ValidarCosto();

        } else if (PE.Editable == true && ProdCadena[i].PrecioUnitario <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor a 0'

            })
            ProdCadena[i].PrecioUnitario = 1;
            ValidarTotales();
            ValidarCosto();

        }

        if (PromoExclusiva != undefined) {


            if (PromoExclusiva.PrecioFinal > ProdCadena[i].PrecioUnitario && PE.Editable == false && Moneda == "CRC") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Precio invalido, el precio tiene que ser mayor o igual a ' + ' ' + PromoExclusiva.PrecioFinal

                })
                ProdCadena[i].PrecioUnitario = PromoExclusiva.PrecioFinal;
                ValidarTotales();
                ValidarCosto();

            } else if ((Pais == "C" ? (PromoExclusiva.PrecioFinal / TipodeCambio.TipoCambio) > ProdCadena[i].PrecioUnitario : (PromoExclusiva.PrecioFinal) > ProdCadena[i].PrecioUnitario) && PE.Editable == false && Moneda == "USD") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Precio invalido, el precio tiene que ser mayor o igual a ' + ' ' + (Pais == "C" ? (PromoExclusiva.PrecioFinal / TipodeCambio.TipoCambio) : PromoExclusiva.PrecioFinal)

                })
                ProdCadena[i].PrecioUnitario = (Pais == "C" ? PromoExclusiva.PrecioFinal / TipodeCambio.TipoCambio : PromoExclusiva.PrecioFinal);
                ValidarTotales();
                ValidarCosto();

            }


        }





    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}
function onChangeCantidadProducto(i) {
    try {
        ProdCadena[i].Cantidad = parseFloat($("#" + i + "_Prod").val()).toFixed(2);
        if (ProdCadena[i].Cantidad > 0) {
            ValidarTotales();
            ValidarCosto();
        }

        else if (ProdCadena[i].Cantidad <= 0) {
            ProdCadena[i].Cantidad = 1;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Cantidad Invalida'

            })
            ProdCadena[i].Cantidad = 1;
            ValidarTotales();
            ValidarCosto();
        }





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

        var totalGX = 0;
        var redondeo = 0;
        var Moneda = $("#selectMoneda").val();

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
                if ((13 - EX.PorExon) < calculoIMP) {
                    var ValorExonerado = (EX.PorExon / 100);
                    var TarifaExonerado = ((ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario) - ProdCadena[i].Descuento) * ValorExonerado;
                    ProdCadena[i].TotalImpuesto -= TarifaExonerado;
                    ProdCadena[i].PorExoneracion = EX.PorExon;
                }
            }
            //Termina Exoneracion
            ProdCadena[i].TotalLinea = (ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario) - ProdCadena[i].Descuento + ProdCadena[i].TotalImpuesto;


            subtotalG += (ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario);
            impuestoG += ProdCadena[i].TotalImpuesto;
            descuentoG += ProdCadena[i].Descuento;
            totalG += ProdCadena[i].TotalLinea;
            totalGX += ProdCadena[i].TotalLinea;

        }

        $("#subG").text(formatoDecimal(subtotalG.toFixed(2)));
        $("#descG").text(formatoDecimal(descuentoG.toFixed(2)));
        $("#impG").text(formatoDecimal(impuestoG.toFixed(2)));
        var TotalAntesRedondeo = totalG;
        totalG = redondearAl5(totalG, Moneda);
        $("#totG").text(formatoDecimal(totalG.toFixed(2)));
        $("#totGX").text(formatoDecimal(totalGX.toFixed(2)));

        redondeo = totalG - TotalAntesRedondeo;

        $("#redondeo").text(formatoDecimal(redondeo.toFixed(2)));

        RellenaTabla();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }
}
function BuscarCliente() {
    try {
        $("#Nombre").val("");
        var selectTP = $("#selectTP").val();
        if (Pais == "C") {
            BuscarClienteRegistro();
        }
        if (Pais == "P" && selectTP != 99) {
            BuscarClientePanama();
        } else if (selectTP == 99) {
            $("#Nombre").removeAttr("readonly");
        }

        console.log($("#Nombre").val());


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'ha ocurrido un error  ' + e

        })
    }
}
function BuscarClienteRegistro() {
    try {
        var Cedula = $("#Cedula").val();

        fetch('https://apis.gometa.org/cedulas/' + $("#Cedula").val() + '&fbclid=IwAR02XHHfB7dQycQ1XGVVo8bhyuRZ_jkNgWCZBW5GscL7S18lnG3jQfgeaS8')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parsea la respuesta como JSON
            })
            .then(data => {
                // Maneja los datos obtenidos
                console.log(data);

                if (data.nombre != undefined) {
                    $("#selectTP").val(data.tipoIdentificacion.toString());

                    if ($("#selectTP").val() != "02" || ($("#selectTP").val() == "02" && Cedula.length >= 10)) {
                        $("#Nombre").val(data.nombre.toString());

                        $("#Nombre").attr("readonly", "readonly");
                    }




                    console.log($("#Nombre").val());
                }

                if ($("#Nombre").val().toString() == "" || $("#Nombre").val().toString() == undefined || $("#Nombre").val().toString() == '' || $("#Nombre").val().toString() == null) {

                    BuscarClienteHacienda();
                }

            })
            .catch(error => {
                // Maneja errores
                console.error('Fetch error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error  ' + error

                })

                if ($("#Nombre").val().toString() == "" || $("#Nombre").val().toString() == undefined || $("#Nombre").val().toString() == '' || $("#Nombre").val().toString() == null) {

                    BuscarClienteHacienda();
                }
            });

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error ' + e

        })
    }



}
function BuscarClienteHacienda() {
    try {
        var Cedula = $("#Cedula").val();
        fetch('https://api.hacienda.go.cr/fe/ae?identificacion=' + $("#Cedula").val() + '&fbclid=IwAR02XHHfB7dQycQ1XGVVo8bhyuRZ_jkNgWCZBW5GscL7S18lnG3jQfgeaS8')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parsea la respuesta como JSON
            })
            .then(data => {
                // Maneja los datos obtenidos
                console.log(data);

                if (data.nombre != undefined) {
                    $("#selectTP").val(data.tipoIdentificacion.toString());

                    if ($("#selectTP").val() != "02" || ($("#selectTP").val() == "02" && Cedula.length >= 10)) {
                        $("#Nombre").val(data.nombre.toString());

                        $("#Nombre").attr("readonly", "readonly");
                    }



                }

                if (($("#Nombre").val().toString() == "" || $("#Nombre").val().toString() == undefined || $("#Nombre").val().toString() == '' || $("#Nombre").val().toString() == null)) {
                    console.log($("#Nombre").val());
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Cliente no encontrado en registros. Contactar a soporte!  '

                    })
                }
                if (($("#selectTP").val() == "02" && Cedula.length < 10)) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Error, la cédula juridica debe tener 10 caracteres'

                    })
                }

            })
            .catch(error => {
                // Maneja errores
                console.error('Fetch error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error  ' + error

                })
            });




    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'ha ocurrido un error  ' + e

        })
    }
}
function BuscarClientePanama() {
    try {
        fetch('https://fepatest-api.webposonline.com/api/fepa/ak/v1/test/CheckRuc/ad733bad-167b-4478-87be-aa2035bba008/' + $("#Cedula").val() + '/0')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parsea la respuesta como JSON
            })
            .then(data => {
                // Maneja los datos obtenidos
                console.log(data);

                if (data.razonSocial != undefined) {

                    $("#Nombre").val(data.razonSocial.toString());
                    $("#selectTP").val(data.tipoRuc.toString().padStart(2, '0'));
                    $("#DV").val(data.dv.toString());
                    $("#Nombre").attr("readonly", "readonly");
                    $("#DV").attr("readonly", "readonly");



                }

                if ($("#Nombre").val().toString() == "" || $("#Nombre").val().toString() == undefined || $("#Nombre").val().toString() == '' || $("#Nombre").val().toString() == null) {
                    console.log($("#Nombre").val());
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Cliente no encontrado en registros. Contactar a soporte!  '

                    })
                }
            })
            .catch(error => {
                // Maneja errores
                console.error('Fetch error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error  ' + error

                })
            });




    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'ha ocurrido un error  ' + e

        })
    }
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
                filename: 'OfertaVenta.pdf',
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