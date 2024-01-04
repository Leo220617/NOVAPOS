
$(document).ready(function () {
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
var DES = [];
var CP = [];
var Vendedores = [];
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
        Cantones = JSON.parse($("#Cantones").val());
        Distritos = JSON.parse($("#Distritos").val());
        Barrios = JSON.parse($("#Barrios").val());
        Clientes = JSON.parse($("#Clientes").val());
        Aprobaciones = JSON.parse($("#Aprobaciones").val());
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
        $("#selectVendedor").val(Oferta.idVendedor);
        $("#Fecha").val(Oferta.Fecha);
        $("#selectMoneda").val(Oferta.Moneda);
        $("#selectTD").val(Oferta.TipoDocumento);
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
                Descripcion: PE.Codigo + " - " + PE.Nombre,
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
                Costo: PE.Costo,
                PorExoneracion: Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion) == undefined ? 0 : Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion).PorExon,
                idExoneracion: Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion) == undefined ? 0 : Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion).id,
                PrecioMin: 0,
                MargenMin: 0

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
        RellenaTabla();
        onChangeCliente();
        ValidarStocks();
        $("#selectCondPago").val(Oferta.idCondPago);


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
function ValidarStocks() {
    try {
        for (var i = 0; i < Oferta.Detalle.length; i++) {
            var PE = Productos.find(a => a.id == Oferta.Detalle[i].idProducto);
            var PS = Productos.find(a => a.Nombre == "SERVICIO TRANSPORTE  (KM)");
            if ((PE.Stock - ProdCadena[i].Cantidad) < 0 && PE.Codigo != PS.Codigo && PE.Editable == false) {
                $.toast({
                    heading: 'Precaución',
                    text: 'El producto' + ' ' + ProdCadena[i].Descripcion + ' ' + 'NO tiene' + ' ' + ProdCadena[i].Cantidad + '' + ' unidades en stock, el stock real es de' + ' ' + PE.Stock,
                    position: 'top-right',
                    loaderBg: '#ff6849',
                    icon: 'warning',
                    hideAfter: 100000000000,
                    stack: 6
                });
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
        totalG = redondearAl5(totalG);
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

        $("#ProductoSeleccionado").html(html);

        html += "<option value='0' > Seleccione Producto </option>";

        ProdClientes.sort(function (a, b) {
            // Compara si a y b tienen promoción, y coloca los que tienen promoción primero
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

            var Promo = DetPromociones.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idListaPrecio == ProdClientes[i].idListaPrecios && a.idCategoria == ProdClientes[i].idCategoria);



            var Bodegas = Bodega.find(a => a.id == ProdClientes[i].idBodega) == undefined ? undefined : Bodega.find(a => a.id == ProdClientes[i].idBodega);

            if (Promo != undefined) {

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

        for (var i = 0; i < ExoneracionesCliente.length; i++) {

            if (Producto != undefined) {
                var ProductoExoneracion = ExoneracionesCliente[i].Detalle.filter(a => a.CodCabys == Producto.Cabys);
                if (ProductoExoneracion.length > 0) {
                    html += "<option value='" + ExoneracionesCliente[i].id + "' selected > " + ExoneracionesCliente[i].NumDoc + " </option>";

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
        var Aprobado = Aprobaciones.find(a => a.idCliente == idCliente);
        var Contado = CP.find(a => a.Nombre == "Contado");

        if ((Cliente.LimiteCredito - Cliente.Saldo) <= 0 && Cliente.idCondicionPago != Contado.id && Aprobado == undefined) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                html: 'Limite de crédito excedido' +
                    '<br><button id="solicitarCreditoBtn" class="swal2-confirm swal2-styled" onclick="Solicitar()">Solicitar Crédito</button>'

            })
        }

        $("#spanDireccion").text(Cliente.Sennas);
        $("#strongInfo").text("Cédula: " + Cliente.Cedula + " " + "Phone: " + Cliente.Telefono + " " + "  " + " " + "  " + "Email: " + Cliente.Email);
        $("#strongInfo2").text("Saldo: " + formatoDecimal(Cliente.Saldo.toFixed(2)) + " " + "  " + " " + "  " + "Limite Credito: " + formatoDecimal(Cliente.LimiteCredito.toFixed(2)) + "  " + "Grupo: " + Grupo.CodSAP + "-" + Grupo.Nombre);


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
                    if ((Cliente.LimiteCredito - Cliente.Saldo) <= 0 && Cliente.idCondicionPago != Contado.id) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Advertencia',
                            html: 'Limite de crédito excedido' +
                                '<br><button id="solicitarCreditoBtn" class="swal2-confirm swal2-styled" onclick="Solicitar()">Solicitar Crédito</button>'

                        })
                    } else if ((Cliente.LimiteCredito - Cliente.Saldo) > 0 && Cliente.idCondicionPago != Contado.id) {
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

        var valorCondicion = Oferta != null || Oferta != undefined ? Oferta.idCondPago : 0;
        var text = "";
        $("#selectCondPago").html(text);

        var Contado = CP.find(a => a.Nombre == "Contado");
        var Transito = CP.find(a => a.Nombre == "Transito");



        text += "<option value='" + Contado.id + "'> " + Contado.Nombre + " </option>";
        if (FP == false && !Name) {
            text += "<option value='" + Transito.id + "'> " + Transito.Nombre + " </option>";
        }

        for (var i = 0; i < CPS.length; i++) {
            if (CPS[i].id != Contado.id && FP == true) {
                if (valorCondicion == CPS[i].id && FP == true) {
                    text += "<option selected value='" + CPS[i].id + "'> " + CPS[i].Nombre + " </option>";

                } else {
                    text += "<option value='" + CPS[i].id + "'> " + CPS[i].Nombre + " </option>";

                }

            }
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
            $("#inputPrecio").val(parseFloat(Producto.PrecioUnitario));
            $("#inputCabys").val(Producto.Cabys);
            $("#inputNomPro").val(Producto.Nombre);
            if (Producto.Serie == true) {
                $("#SerieSelect").removeAttr("hidden");

                RellenaSeriesProductos();
            } else {
                $("#SerieSelect").attr("hidden", true);
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
                                            LimiteCredito: json.cliente.limiteCredito,
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
        var PS = Productos.find(a => a.Nombre == "SERVICIO TRANSPORTE  (KM)");
        var MonedaDoc = $("#selectMoneda").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        for (var i = 0; i < ProdCadena.length; i++) {
            var PE = Productos.find(a => a.id == ProdCadena[i].idProducto);
            if (PE.Stock - ProdCadena[i].Cantidad > 0 || PE.Stock > 0 || PE.Codigo == PS.Codigo || PE.Editable == true) {
                var TotalGanancia = (ProdCadena[i].TotalLinea - ProdCadena[i].TotalImpuesto);
                html += "<tr>";

                html += "<td> " + (i + 1) + " </td>";

                html += "<td > " + ProdCadena[i].Descripcion + " </td>";
                html += "<td class='text-center'> <input onchange='javascript: onChangeCantidadProducto(" + i + ")' type='number' id='" + i + "_Prod' class='form-control'   value= '" + formatoDecimal(parseFloat(ProdCadena[i].Cantidad).toFixed(2)) + "' min='1'/>  </td>";
                html += "<td class='text-center'> <input onchange='javascript: onChangePrecioProducto(" + i + ")' type='number' id='" + i + "_Prod3' class='form-control'   value= '" + parseFloat(ProdCadena[i].PrecioUnitario).toFixed(2) + "' min='1'/> </td>";
                html += "<td class='text-center'> <input onchange='javascript: onChangeDescuentoProducto(" + i + ")' type='number' id='" + i + "_Prod2' class='form-control'   value= '" + formatoDecimal(parseFloat(ProdCadena[i].PorDescto).toFixed(2)) + "' min='1'/>  </td>";
                html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].Descuento).toFixed(2)) + " </td>";
                html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].TotalImpuesto).toFixed(2)) + " </td>";
               /* html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PorExoneracion).toFixed(2)) + " </td>";*/
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

                if (PE.Serie == true) {
                    html += "<td class='text-center'> <a href='#test-form' class='popup-with-form fa fa-info-circle icono' onclick='javascript:AbrirModalSeries(" + i + ") '> </a> </td>";
                }

                html += "</tr>";
            } else {




            }

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



        var Producto =
        {
            idEncabezado: 0,
            Descripcion: PE.Codigo + " - " + PE.Nombre,
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
            NomPro: $("#inputNomPro").val(),
            idExoneracion: $("#exoneracion").val(),
            PorExoneracion: 0,
            Costo: PE.Costo,
            PrecioMin: 0,
            MargenMin: 0
        };

        var Descuento = parseFloat($("#DES").val());
        var PS = Productos.find(a => a.Nombre == "SERVICIO TRANSPORTE  (KM)");

        var LotesArray = LotesCadena.filter(a => a.ItemCode == PE.Codigo);
        var cantidad = parseInt($("#cantidad").val());
        var Promo = DetPromociones.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria);
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
                Producto.MargenMin = MargenMin - (MargenMin * DescuentoCliente);

                Producto.PrecioMin = PrecioMin - (PrecioMin * DescuentoCliente);
            } else {
                Producto.MargenMin = MargenMin;
                Producto.PrecioMin = PrecioMin;
            }
        }



        var cantidades = 0;

        for (var i = 0; i < LotesArray.length; i++) {
            cantidades += parseInt(LotesArray[i].Cantidad);
        }
        if (cantidades < cantidad && PE.Serie == true) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'La cantidad de Series es menor a la cantidad digitada'

            })
            return false;
        }

        for (var i = 0; i < ProdCadena.length; i++) {


            if (PE.id == ProdCadena[i].idProducto) {
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


        if ((PE.Stock - Producto.Cantidad) < 0 && PE.Codigo != PS.Codigo) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Producto sin stock valido'

            })



        }

        if (PE.PrecioUnitario > Producto.PrecioUnitario) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor o igual a ' + ' ' + PE.PrecioUnitario

            })



        }

        if (Producto.Cantidad <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Cantidad Invalida'

            })

        }
        if (Producto.PorDescto < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Descuento Invalido'

            })

        }
        if (Promo != undefined && Producto.PorDescto > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se puede aplicar más descuentos, el Producto ' + Producto.Descripcion + ' ya tiene una Promoción'

            })

        }
        var DescuentoMaximo = ((Producto.PrecioUnitario - Producto.PrecioMin) / Producto.PrecioUnitario) * 100;
        var DescuentoX = Producto.PrecioUnitario * (Producto.PorDescto / 100);
        var PrecioFinal = Producto.PrecioUnitario - DescuentoX;

        if (Producto.PrecioMin > PrecioFinal && Promo == undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se puede aplicar el descuento debido a que es menor al Precio Minimo, el Producto ' + Producto.Descripcion + ' lo maximo que se le puede aplicar de Descuento es de ' + parseFloat(DescuentoMaximo).toFixed(2) + '%'

            })

        }
        if (Producto.PorDescto > Descuento) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Usted no puede aplicar este descuento, el descuento máximo asignado a su usuario es de' + ' ' + parseFloat(Descuento).toFixed(2) + '%'

            })

        } else if (((Promo != undefined && Producto.PorDescto == 0) || (Promo == undefined)) && Producto.PrecioMin <= PrecioFinal && ((PE.Serie == true && Producto.NumSerie != "0") || (PE.Serie == false)) && Duplicado == false && Producto.Cantidad > 0 && Producto.PorDescto >= 0 && Producto.PorDescto <= Descuento && ((PE.Stock - Producto.Cantidad) >= 0) && PE.PrecioUnitario <= Producto.PrecioUnitario || PE.Codigo == PS.Codigo) {

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
                totalGX += Producto.TotalLinea;

                $("#subG").text(formatoDecimal(subtotalG.toFixed(2)));
                $("#descG").text(formatoDecimal(descuentoG.toFixed(2)));
                $("#impG").text(formatoDecimal(impuestoG.toFixed(2)));
                var TotalAntesRedondeo = totalG;
                totalG = redondearAl5(totalG);
                $("#totG").text(formatoDecimal(totalG.toFixed(2)));
                $("#totGX").text(formatoDecimal(totalGX.toFixed(2)));
                redondeo = totalG - TotalAntesRedondeo;

                $("#redondeo").text(formatoDecimal(redondeo.toFixed(2)));

                ProdCadena.push(Producto);

                RellenaTabla();
                onChangeMoneda();

                $("#ProductoSeleccionado").val("0").trigger('change.select2');
                $("#SerieSeleccionado").val("0").trigger('change.select2');
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

    var Producto = ProdCadena[i];
    var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);


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
    totalG = redondearAl5(totalG);
    $("#totG").text(formatoDecimal(totalG.toFixed(2)));
    $("#totGX").text(formatoDecimal(totalGX.toFixed(2)));
    redondeo = totalG - TotalAntesRedondeo;

    $("#redondeo").text(formatoDecimal(redondeo.toFixed(2)));
    ProdCadena.splice(i, 1);
    var Lotes2 = LotesCadena.filter(a => a.ItemCode == PE.Codigo);

    for (var x = 0; x < Lotes2.length; x++) {

        LotesCadena.splice(LotesCadena.indexOf(LotesCadena.find(a => a.ItemCode == PE.Codigo)), 1);

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
                title: '¿Desea editar la orden de venta?',
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
                        data: { recibidos: EncOferta },
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
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.oferta

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
        var redondeo = parseFloat(ReplaceLetra($("#redondeo").text()));
        var totalGX = parseFloat(ReplaceLetra($("#totGX").text()));

        var Cliente = Clientes.find(a => a.id == idCliente);
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var CondPago = $("#selectCondPago").val();
        var Aprobado = Aprobaciones.find(a => a.idCliente == idCliente);

        if ($("#selectMoneda").val() != "CRC") {
            totalG = totalG * TipodeCambio.TipoCambio;
            redondeo = redondeo * TipodeCambio.TipoCambio;
            totalGX = totalGX * TipodeCambio.TipoCambio;
        }
        for (var i = 0; i < e.Detalle.length; i++) {
            var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);
            if (PE.Editable == true) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error al intentar agregar, no se puede guardar la Orden de Venta con productos editables '

                })
                return false;

            }
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
        } if ((Cliente.LimiteCredito - Cliente.Saldo) < totalG && CondPago != Contado.id && CondPago != Transito.id && Aprobado == undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: 'El total de la factura es mayor al Limite de crédito' +
                    '<br><button id="solicitarCreditoBtn" class="swal2-confirm swal2-styled" onclick="Solicitar()">Solicitar Crédito</button>'


            })
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

        var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);
        var Promo = DetPromociones.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria);


        var DescuentoMaximoX = ((ProdCadena[i].PrecioUnitario - ProdCadena[i].PrecioMin) / ProdCadena[i].PrecioUnitario) * 100;
        var DescuentoMaximo = Math.floor(DescuentoMaximoX * 100) / 100;
        var DescuentoX = ProdCadena[i].PrecioUnitario * (ProdCadena[i].PorDescto / 100);
        var PrecioFinal = ProdCadena[i].PrecioUnitario - DescuentoX;

        if (ProdCadena[i].PorDescto >= 0 && ProdCadena[i].PorDescto <= Descuento && Promo == undefined && ProdCadena[i].PrecioMin <= PrecioFinal) {
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
        if (Promo != undefined) {
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


        for (var i = 0; i < ProdCadena.length; i++) {


            var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);

            var Promo = DetPromociones.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria);


            var DescuentoMaximo = ((ProdCadena[i].PrecioUnitario - ProdCadena[i].PrecioMin) / ProdCadena[i].PrecioUnitario) * 100;
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
        ;
        ProdCadena[i].PrecioUnitario = parseFloat($("#" + i + "_Prod3").val()).toFixed(2);

        if (ProdCadena[i].PrecioUnitario >= PE.PrecioUnitario || (PE.Editable == true && ProdCadena[i].PrecioUnitario > 0)) {
            ValidarTotales();
            ValidarCosto();
        }
        else if (PE.PrecioUnitario > ProdCadena[i].PrecioUnitario && PE.Editable == false) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor o igual a ' + ' ' + PE.PrecioUnitario

            })
            ProdCadena[i].PrecioUnitario = PE.PrecioUnitario;
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

        var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);
        var PS = Productos.find(a => a.Nombre == "SERVICIO TRANSPORTE  (KM)");
        ProdCadena[i].Cantidad = parseFloat($("#" + i + "_Prod").val()).toFixed(2);

        if (ProdCadena[i].Cantidad > 0 && (PE.Stock - ProdCadena[i].Cantidad) >= 0 || PE.Codigo == PS.Codigo || (PE.Editable == true && ProdCadena[i].Cantidad > 0)) {
            ValidarTotales();
            ValidarCosto();
        }
        else if ((PE.Stock - ProdCadena[i].Cantidad) < 0 && PE.Codigo != PS.Codigo && PE.Editable == false) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Producto sin stock valido, el stock es de' + ' ' + PE.Stock

            })
            ProdCadena[i].Cantidad = PE.Stock;
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

        for (var i = 0; i < ProdCadena.length; i++) {
            var idCliente = $("#ClienteSeleccionado").val();
            var Cliente = Clientes.find(a => a.id == idCliente);
            var IMP2 = Impuestos.find(a => a.Tarifa == 1);
            var EX = Exoneraciones.find(a => a.id == ProdCadena[i].idExoneracion);

            var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);
            var PS = Productos.find(a => a.Nombre == "SERVICIO TRANSPORTE  (KM)");
            if (ProdCadena[i].Cantidad <= 0 && PE.Codigo != PS.Codigo) {
                EliminarProducto(i);
            }
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
            totalGX += ProdCadena[i].TotalLinea;

        }

        $("#subG").text(formatoDecimal(subtotalG.toFixed(2)));
        $("#descG").text(formatoDecimal(descuentoG.toFixed(2)));
        $("#impG").text(formatoDecimal(impuestoG.toFixed(2)));
        var TotalAntesRedondeo = totalG;
        totalG = redondearAl5(totalG);
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
        //$.ajax({
        //    type: 'GET',
        //    dataType: 'json',
        //    url: 'https://apis.gometa.org/cedulas/' + $("#Cedula").val() + '&fbclid=IwAR02XHHfB7dQycQ1XGVVo8bhyuRZ_jkNgWCZBW5GscL7S18lnG3jQfgeaS8', //Nombre del metodo
        //    data: {},
        //    success: function (result) {

        //        console.log(result);

        //        if (result.nombre != undefined) {
        //            $("#Nombre").val(result.nombre);
        //            $("#selectTP").val(result.tipoIdentificacion);
        //            $("#Nombre").attr("readonly", "readonly");


        //        }



        //    },
        //    beforeSend: function () {

        //    },
        //    complete: function () {

        //    }
        //});


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
                    $("#Nombre").val(data.nombre);
                    $("#selectTP").val(data.tipoIdentificacion);
                    $("#Nombre").attr("readonly", "readonly");


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
            text: 'Ha ocurrido un error ' + e

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