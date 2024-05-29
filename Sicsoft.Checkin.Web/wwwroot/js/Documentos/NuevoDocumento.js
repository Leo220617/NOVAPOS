


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
var TipoCambio = [];
var MetodosPagos = [];
var Documento = [];
var CB = [];
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
var MiSucursal = [];

function HideP() {
    try {
        $("#boxP").hide();
        $("#AgregarC").hide();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
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
function ReadOnlyC() {
    try {
        $("#boxC").attr("readonly", "readonly");
        $("#selectCondPago").attr("disabled", "disabled");
        /*    $("#selectMoneda").attr("disabled", "disabled");*/
        $("#ClienteSeleccionado").attr("disabled", "disabled");
        $("#selectCondPago").attr("disabled", "disabled");
        $("#selectVendedor").attr("disabled", "disabled");
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }
}
function CerrarPopUpLotes() {
    try {
        $('#listoCerrar').magnificPopup('close');
    } catch (e) {
        alert(e);
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
        TipoCambio = JSON.parse($("#TipoCambio").val());
        Documento = JSON.parse($("#Documento").val());
        CB = JSON.parse($("#CB").val());
        CP = JSON.parse($("#CP").val());
        DES = JSON.parse($("#DES").val());
        Bodega = JSON.parse($("#Bodega").val());
        Sucursal = JSON.parse($("#Sucursal").val());
        ExoneracionesCliente = [];
        SeriesProductos = JSON.parse($("#SeriesProductos").val());
        DetPromociones = JSON.parse($("#DetPromociones").val());
        Margenes = JSON.parse($("#Margenes").val());
        DetMargenes = JSON.parse($("#DetMargenes").val());
        MiSucursal = JSON.parse($("#Sucursal").val());

        RellenaClientes();
        RellenaVendedores();

        RellenaExoneraciones();
        maskCedula();

        if (Documento != null || Documento != undefined) {
            if (Documento.BaseEntry != 0) {
                RecuperarInformacion();

                HideP();
                ReadOnlyC();
            }
            // HIDDEN por medio de jquery lo de agregar productos y poner readonly el resto de cosas
            // Puede ser un metodo nuevo o hacerlo todo chorreado aqui 

        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }

}
function RecuperarInformacion() {
    try {
        var lot = JSON.parse($("#Lotes").val());
        $("#ClienteSeleccionado").val(Documento.idCliente);
        $("#selectVendedor").val(Documento.idVendedor);
        $("#Fecha").val(Documento.Fecha);
        $("#selectTD").val(Documento.TipoDocumento);
        $("#selectMoneda").val(Documento.Moneda);

        $("#selectCondPago").val(Documento.idCondPago);
        $("#inputComentarios").val(Documento.Comentarios);
        $("#subG").text(formatoDecimal(Documento.Subtotal.toFixed(2)));
        $("#impG").text(formatoDecimal(Documento.TotalImpuestos.toFixed(2)));
        $("#descG").text(formatoDecimal(Documento.TotalDescuento.toFixed(2)));
        $("#totG").text(formatoDecimal(Documento.TotalCompra.toFixed(2)));
        $("#redondeo").text(formatoDecimal(Documento.Redondeo.toFixed(2)));
        $("#descuento").text(formatoDecimal(Documento.PorDescto.toFixed(2)));

        Inicio = true;

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
                Costo: PE.Costo,

                PorExoneracion: Exoneraciones.find(a => a.id == Documento.Detalle[i].idExoneracion) == undefined ? 0 : Exoneraciones.find(a => a.id == Documento.Detalle[i].idExoneracion).PorExon,
                idExoneracion: Exoneraciones.find(a => a.id == Documento.Detalle[i].idExoneracion) == undefined ? 0 : Exoneraciones.find(a => a.id == Documento.Detalle[i].idExoneracion).id,
                PrecioMin: 0


            };
            var DetMargen = DetMargenes.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Moneda == PE.Moneda);
            var Margen = Margenes.find(a => a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Moneda == PE.Moneda);

            if (DetMargen != undefined) {
                Producto.PrecioMin = DetMargen.PrecioMin;

            } else if (Margen != undefined) {
                var PrecioCob = PE.Costo / (1 - (Margen.Cobertura / 100));
                Producto.PrecioMin = PrecioCob / (1 - (Margen.MargenMin / 100));
            }
            ProdCadena.push(Producto);
        }
        if (lot != null) {
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
        }
        RellenaTabla();

        onChangeCliente();
        ValidarStocks();

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
        for (var i = 0; i < Documento.Detalle.length; i++) {
            var PE = Productos.find(a => a.id == Documento.Detalle[i].idProducto);
            var PS = Productos.find(a => a.Nombre == "SERVICIO TRANSPORTE  (KM)");
            if ((PE.Stock - ProdCadena[i].Cantidad) < 0 && PE.Codigo != PS.Codigo) {
                $.toast({
                    heading: 'Precaución',
                    text: 'El producto' + ' ' + ProdCadena[i].Descripcion + ' ' + 'NO tiene' + ' ' + ProdCadena[i].Cantidad + '' + ' unidades en stock, el stock real es de' + ' ' + PE.Stock,
                    position: 'top-right',
                    loaderBg: '#ff6849',
                    icon: 'warning',
                    hideAfter: 100000000000,
                    stack: 6
                });
                ProdCadena[i].Cantidad = 0;

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
        var totalGX = 0;
        var redondeo = 0;
        var Moneda = $("#selectMoneda").val();

        for (var i = 0; i < ProdCadena.length; i++) {

            var idCliente = $("#ClienteSeleccionado").val();
            var Cliente = Clientes.find(a => a.id == idCliente);
            var IMP2 = Impuestos.find(a => a.Tarifa == 1);
            var EX = Exoneraciones.find(a => a.id == ProdCadena[i].idExoneracion);

            var PE = Productos.find(a => a.id == ProdCadena[i].idProducto);
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
            text: 'Ha ocurrido un error al intentar imprimir ' + e

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

        if ((Cliente.LimiteCredito - Cliente.Saldo) <= 0 && Cliente.idCondicionPago != Contado.id && Aprobado == undefined) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                html: 'Limite de crédito excedido' +
                    '<br><button id="solicitarCreditoBtn" class="swal2-confirm swal2-styled" onclick="Solicitar()">Solicitar Crédito</button>'

            })
        }
        var contieneContado = Cliente.Nombre.toUpperCase().includes("CONTADO");

        if (contieneContado) {

            $("#selectTD option[value='01']").remove();
        } else {

            if ($("#selectTD option[value='01']").length === 0) {
                $("#selectTD").append('<option value="01">Factura Electrónica</option>');

            }
        }
        if (!contieneContado) {

            $("#selectTD option[value='04']").remove();
        } else {

            if ($("#selectTD option[value='04']").length === 0) {
                $("#selectTD").append('<option value="04">Tiquete Electrónico</option>');


            }
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

        var CondP = CP.filter(a => a.id == Cliente.idCondicionPago);
        var Aprobado = Aprobaciones.find(a => a.idCliente == idClientes);
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
function RellenaCondiciones(CPS) {
    try {
        var idClientes = $("#ClienteSeleccionado").val();
        var Cliente = Clientes.find(a => a.id == idClientes).Nombre;
        var Name = Cliente.includes("CONTADO");
        var Clientex = Clientes.find(a => a.id == idClientes);
        var valorCondicion = Documento != null || Documento != undefined ? Documento.idCondPago : 0;
        var text = "";
        $("#selectCondPago").html(text);

        var Contado = CP.find(a => a.Nombre == "Contado");
        var Transito = CP.find(a => a.Nombre == "Transito");
        var CondP = CP.filter(a => a.id == Cliente.idCondicionPago);




        if (Clientex.Transitorio && Clientex.idCondicionPago == Contado.id) {
            text += "<option value='" + Contado.id + "'> " + Contado.Nombre + " </option>";
            if (FP == false && !Name) {
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
            $("#selectCondPago").val(Documento.idCondPago);
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
function ExoneracionxCliente() {
    try {
        var idCliente = $("#ClienteSeleccionado").val();
        ExoneracionesCliente = Exoneraciones.filter(a => a.idCliente == idCliente && a.Activo == true);

        RellenaExoneraciones();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

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
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

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
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

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
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

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
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

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
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

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

        } else if (cliente.idGrupo == "" || cliente.idGrupo == null || cliente.idGrupo == '0') {
            return false;
        } else if (cliente.TipoCedula == "02" && cliente.Cedula.length < 10) {
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
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

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
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

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
            if (PE.Stock - ProdCadena[i].Cantidad > 0 || PE.Stock > 0 || PE.Codigo == PS.Codigo) {
                var TotalGanancia = (ProdCadena[i].TotalLinea - ProdCadena[i].TotalImpuesto);
                html += "<tr>";

                html += "<td> " + (i + 1) + " </td>";

                html += "<td > " + ProdCadena[i].Descripcion + " </td>";
                html += "<td class='text-center'> " + formatoDecimal(parseFloat(ProdCadena[i].Cantidad).toFixed(2)) + " </td>";
                html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PrecioUnitario).toFixed(2)) + " </td>";
                
                if ($("#ParamPrecioDescuento").val() == "true") {
                    html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PrecioUnitario - (ProdCadena[i].Descuento / ProdCadena[i].Cantidad)).toFixed(2)) + " </td>";
                } else {
                    html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].Descuento).toFixed(2)) + " </td>";
                }
                html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].TotalImpuesto / ProdCadena[i].Cantidad).toFixed(2)) + " </td>";
                html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PorExoneracion).toFixed(2)) + " </td>";
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
            text: 'Ha ocurrido un error al intentar agregar ' + e
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
        var PE = ProdClientes.find(a => a.id == id);
        var Moneda = $("#selectMoneda").val();

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
            PorExoneracion: 0,
            Codigo: PE.Codigo,
            Costo: PE.Costo,
            PrecioMin: 0

        };
        var Descuento = parseFloat($("#DES").val());
        var PS = Productos.find(a => a.Nombre == "SERVICIO TRANSPORTE  (KM)");

        var LotesArray = LotesCadena.filter(a => a.ItemCode == PE.Codigo);
        var cantidad = parseInt($("#cantidad").val());
        var Promo = DetPromociones.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria);
        var DetMargen = DetMargenes.find(a => a.ItemCode == PE.Codigo && a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Moneda == PE.Moneda);
        var Margen = Margenes.find(a => a.idListaPrecio == PE.idListaPrecios && a.idCategoria == PE.idCategoria && a.Moneda == PE.Moneda);

        if (DetMargen != undefined) {
            Producto.PrecioMin = DetMargen.PrecioMin;

        } else if (Margen != undefined) {
            var PrecioCob = PE.Costo / (1 - (Margen.Cobertura / 100));
            Producto.PrecioMin = PrecioCob / (1 - (Margen.MargenMin / 100));
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
        } if (Producto.Cantidad <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Cantidad Invalida'

            })
            Producto.Cantidad = 1;
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

        }
        if (Producto.PrecioUnitario <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se puede agregar un producto con Precio 0'

            })

        }
        else if ( Producto.PrecioUnitario > 0 && ((Promo != undefined && Producto.PorDescto == 0) || (Promo == undefined)) && ((Producto.PrecioMin <= PrecioFinal && Promo == undefined) || (Promo != undefined)) && ((PE.Serie == true && Producto.NumSerie != "0") || (PE.Serie == false)) && Duplicado == false && Producto.Cantidad > 0 && Producto.PorDescto >= 0 && Producto.PorDescto <= Descuento && ((PE.Stock - Producto.Cantidad) >= 0)  || Producto.Codigo == PS.Codigo) {
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
            text: 'Error en: ' + e

        })
    }

}

function EliminarProducto(i) {
    try {
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
        RellenaTabla();
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

        })
    }


}

//Generar
function Generar() {
    try {

        var button = document.getElementById("botonG");
        var EncDocumento = {
            id: 0,
            idCliente: $("#ClienteSeleccionado").val(),
            idVendedor: $("#selectVendedor").val(),
            idUsuarioCreador: 0,
            idOferta: Documento == null ? 0 : Documento.idOferta,
            idCondPago: $("#selectCondPago").val(),
            Fecha: $("#Fecha").val(),
            FechaVencimiento: $("#Fecha").val(),
            Comentarios: $("#inputComentarios").val(),
            Subtotal: parseFloat(ReplaceLetra($("#subG").text())),
            TotalImpuestos: parseFloat(ReplaceLetra($("#impG").text())),
            TotalDescuento: parseFloat(ReplaceLetra($("#descG").text())),
            TotalCompra: parseFloat(ReplaceLetra($("#totGX").text())),
            Redondeo: parseFloat(ReplaceLetra($("#redondeo").text())),
            PorDescto: parseFloat(ReplaceLetra($("#descuento").val())),
            CodSuc: "",
            Moneda: $("#selectMoneda").val(),
            TipoDocumento: $("#selectTD").val(),
            MetodosPagos: MetodosPagos,
            Detalle: ProdCadena,
            Lotes: LotesCadena
        }

        if (validarDocumento(EncDocumento)) {

            Swal.fire({
                title: '¿Desea guardar el Documento?',
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
                    button.disabled = true;
                    var jsonString = JSON.stringify(EncDocumento);
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


                            console.log("resultado " + json.documento);
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
                                        var Contado = CP.find(a => a.Nombre == "Contado");

                                        if ($("#selectCondPago").val() == Contado.id) {
                                            ImprimirTiquete(json.documento);

                                        } else {
                                            ImprimirTiqueteC(json.documento);

                                        }

                                        window.location.href = window.location.href.split("/Nuevo")[0];


                                    }
                                })

                            } else {
                                button.disabled = false;
                                $("#divProcesando").modal("hide");
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.documento

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
                            button.disabled = false;
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
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Parece que faltan datos por llenar'

            })
        }

    } catch (e) {
        $("#divProcesando").modal("hide");
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


        var sumatoriaPagos = 0;
        var idCliente = $("#ClienteSeleccionado").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var Aprobado = Aprobaciones.find(a => a.idCliente == idCliente);
      


        for (var i = 0; i < e.MetodosPagos.length; i++) {
            if ($("#selectMoneda").val() != e.MetodosPagos[i].Moneda) {
                if (e.MetodosPagos[i].Moneda != "CRC") {
                    sumatoriaPagos += e.MetodosPagos[i].Monto * TipoCambio.TipoCambio;
                } else {
                    sumatoriaPagos += e.MetodosPagos[i].Monto / TipoCambio.TipoCambio;

                }
            } else {
                sumatoriaPagos += e.MetodosPagos[i].Monto;
            }
        }
        var sumatoriaPagosX = parseFloat(sumatoriaPagos.toFixed(2));
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
            } else if (sumatoriaPagosX + 1 < parseFloat((e.TotalCompra + e.Redondeo).toFixed(2))) {
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
            } else if (e.idVendedor == "0" || e.idVendedor == null) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error al intentar agregar, falta el vendedor '

                })
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
    var suma = 0;
    for (var i = 0; i < array.length; i++) {
        suma += parseFloat(array[i].Monto);
    }
    return suma;
}
function BuscarCliente() {
    try {
        $("#Nombre").val("");
        BuscarClienteRegistro();
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

                    $("#Nombre").val(data.nombre.toString());
                    $("#selectTP").val(data.tipoIdentificacion.toString());
                    $("#Nombre").attr("readonly", "readonly");


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

                    $("#Nombre").val(data.nombre.toString());
                    $("#selectTP").val(data.tipoIdentificacion.toString());
                    $("#Nombre").attr("readonly", "readonly");



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
        if ($("#selectVendedor").val() == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta el vendedor '

            })
            return false;
        }
        $(".MetodosPagoRellenar").hide();
        var Contado = CP.find(a => a.Nombre == "Contado");
        var Transito = CP.find(a => a.Nombre == "Transito");
        var idCliente = $("#ClienteSeleccionado").val();
        var totalG = parseFloat(ReplaceLetra($("#totG").text()));

        var Cliente = Clientes.find(a => a.id == idCliente);
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var CondPago = $("#selectCondPago").val();
        var Aprobado = Aprobaciones.find(a => a.idCliente == idCliente);
        if ($("#selectMoneda").val() != "CRC") {
            totalG = totalG * TipodeCambio.TipoCambio;
        }

        if ((Cliente.LimiteCredito - Cliente.Saldo) < totalG && CondPago != Contado.id && CondPago != Transito.id && Aprobado == undefined) {
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

               

                $("#TipCam").val(TipodeCambio.TipoCambio);
                if ($("#selectCondPago").val() == Contado.id) {

                    if ($("#selectMoneda").val() == "CRC") {
                        var Total = parseFloat(ReplaceLetra($("#totG").text()));
                        $("#totPago").text(formatoDecimal(Total));
                        $("#fatPago").text(formatoDecimal(Total));
                        $("#selectMonedaP").val($("#selectMoneda").val());


                        $("#totPagoD").text(formatoDecimal(Total / TipodeCambio.TipoCambio));
                        $("#fatPagoD").text(formatoDecimal(Total / TipodeCambio.TipoCambio));


                        onChangeMetodo();
                        RellenaCB();


                        $("#modalPagos").modal("show");
                    } else {
                        var Total = parseFloat(ReplaceLetra($("#totG").text()));
                        $("#totPagoD").text(formatoDecimal(Total));
                        $("#fatPagoD").text(formatoDecimal(Total));
                        $("#selectMonedaP").val($("#selectMoneda").val());


                        $("#totPago").text(formatoDecimal(Total * TipodeCambio.TipoCambio));
                        $("#fatPago").text(formatoDecimal(Total * TipodeCambio.TipoCambio));


                        onChangeMetodo();
                        RellenaCB();
                        $("#modalPagos").modal("show");
                    }
                } else {
                    Generar();
                }
                return true;
            }

        }
        else {



            $("#TipCam").val(TipodeCambio.TipoCambio);
            if ($("#selectCondPago").val() == Contado.id) {

                if ($("#selectMoneda").val() == "CRC") {
                    var Total = parseFloat(ReplaceLetra($("#totG").text()));
                    $("#totPago").text(formatoDecimal(Total));
                    $("#fatPago").text(formatoDecimal(Total));
                    $("#selectMonedaP").val($("#selectMoneda").val());


                    $("#totPagoD").text(formatoDecimal(Total / TipodeCambio.TipoCambio));
                    $("#fatPagoD").text(formatoDecimal(Total / TipodeCambio.TipoCambio));


                    onChangeMetodo();
                    RellenaCB();


                    $("#modalPagos").modal("show");
                } else {
                    var Total = parseFloat(ReplaceLetra($("#totG").text()));
                    $("#totPagoD").text(formatoDecimal(Total));
                    $("#fatPagoD").text(formatoDecimal(Total));
                    $("#selectMonedaP").val($("#selectMoneda").val());


                    $("#totPago").text(formatoDecimal(Total * TipodeCambio.TipoCambio));
                    $("#fatPago").text(formatoDecimal(Total * TipodeCambio.TipoCambio));


                    onChangeMetodo();
                    RellenaCB();
                    $("#modalPagos").modal("show");
                }
            } else {
                Generar();
            }
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

                            //Monto: MonedaDoc != "CRC" ? (Moneda != MonedaDoc ? parseFloat(ReplaceLetra($("#MontoPago").val())) / TipodeCambio.TipoCambio : parseFloat(ReplaceLetra($("#MontoPago").val())) * TipodeCambio.TipoCambio) : (Moneda != MonedaDoc ? parseFloat(ReplaceLetra($("#MontoPago").val())) * TipodeCambio.TipoCambio : parseFloat(ReplaceLetra($("#MontoPago").val())) / TipodeCambio.TipoCambio),

                            BIN: $("#BINPago").val(),
                            NumReferencia: $("#ReferenciaPago").val(),
                            NumCheque: "",
                            Metodo: "Tarjeta",
                            Moneda: $("#selectMonedaP").val(),
                            MonedaVuelto: "",
                            PagadoCon: 0
                        };
                        MetodosPagos.push(Detalle);

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
                            Moneda: $("#selectMonedaP").val(),
                            MonedaVuelto: "",
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
                            Moneda: $("#selectMonedaP").val(),
                            MonedaVuelto: "",
                            PagadoCon: 0
                        };
                        MetodosPagos.push(Detalle);

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

        for (var i = 0; i < MetodosPagos.length; i++) {
            text += "<tr>";
            text += "<td class='text-center'> " + MetodosPagos[i].Metodo + " </td>";
            text += "<td class='text-center'> " + MetodosPagos[i].BIN + " </td>";
            text += "<td class='text-center'> " + MetodosPagos[i].NumReferencia + " </td>";
            /*  text += "<td class='text-center'> " + MetodosPagos[i].NumCheque + " </td>";*/
            text += "<td class='text-center'> " + MetodosPagos[i].Moneda + " </td>";
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
            TotalD = parseFloat(ReplaceLetra($("#totG").text()));
            Total = TotalD * TipodeCambio.TipoCambio;
        } else {
            Total = parseFloat(ReplaceLetra($("#totG").text()));
            TotalD = Total / TipodeCambio.TipoCambio;
        }

        for (var i = 0; i < MetodosPagos.length; i++) {

            // if (MetodosPagos[i].Moneda == MonedaDoc) {
            if (MetodosPagos[i].Moneda != "CRC") { // Moneda del Pago viene en USD

                PagadoTD += MetodosPagos[i].Monto;
                PagadoT += MetodosPagos[i].Monto * TipodeCambio.TipoCambio;

                PagadoD += MetodosPagos[i].Monto;
                //   Pagado += MetodosPagos[i].Monto * TipodeCambio.TipoCambio;
                if (MetodosPagos[i].Metodo == "Efectivo") {

                    if (MetodosPagos[i].PagadoCon > 0) {

                        if (MetodosPagos[i].Moneda != MonedaDoc) { // SI USD = Moneda DOC
                            vueltoTD += (MetodosPagos[i].PagadoCon) - MetodosPagos[i].Monto;
                            vueltoT += ((MetodosPagos[i].PagadoCon) - MetodosPagos[i].Monto) * TipodeCambio.TipoCambio;

                            vueltoD += (MetodosPagos[i].PagadoCon) - MetodosPagos[i].Monto;
                        } else {
                            vueltoTD += MetodosPagos[i].PagadoCon - MetodosPagos[i].Monto;
                            vueltoT += (MetodosPagos[i].PagadoCon - MetodosPagos[i].Monto) * TipodeCambio.TipoCambio;

                            vueltoD += MetodosPagos[i].PagadoCon - MetodosPagos[i].Monto;
                        }

                        // vuelto += (MetodosPagos[i].PagadoCon - MetodosPagos[i].Monto) * TipodeCambio.TipoCambio;
                    }
                }

            } else {

                PagadoT += MetodosPagos[i].Monto;
                PagadoTD += MetodosPagos[i].Monto / TipodeCambio.TipoCambio;
                Pagado += MetodosPagos[i].Monto;
                // PagadoD += MetodosPagos[i].Monto / TipodeCambio.TipoCambio;

                if (MetodosPagos[i].Metodo == "Efectivo") {

                    if (MetodosPagos[i].PagadoCon > 0) {
                        if (MetodosPagos[i].Moneda != MonedaDoc) {
                            vueltoT += (MetodosPagos[i].PagadoCon) - MetodosPagos[i].Monto;
                            vueltoTD += ((MetodosPagos[i].PagadoCon) - MetodosPagos[i].Monto) / TipodeCambio.TipoCambio;

                            vuelto += (MetodosPagos[i].PagadoCon) - MetodosPagos[i].Monto;

                        } else {
                            vueltoT += MetodosPagos[i].PagadoCon - MetodosPagos[i].Monto;
                            vueltoTD += (MetodosPagos[i].PagadoCon - MetodosPagos[i].Monto) / TipodeCambio.TipoCambio;

                            vuelto += MetodosPagos[i].PagadoCon - MetodosPagos[i].Monto;
                        }

                        // vueltoD += (MetodosPagos[i].PagadoCon - MetodosPagos[i].Monto) / TipodeCambio.TipoCambio;
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

function ImprimirTiquete(Documento) {
    try {



        var ventana = window.open('', 'PRINT', 'height=400,width=600');
        var texto = htmlContado;
        texto = texto.replace("@Fecha", Documento.fecha.split("T")[0] + " " + Documento.fecha.split("T")[1].substring(0, 8));
        texto = texto.replace("@NumInterno", Documento.id);
        texto = texto.replace("@CodSuc", MiSucursal.CodSuc);
        texto = texto.replace("@NumComprobante", Documento.consecutivoHacienda);
        texto = texto.replace("@NumFactura", Documento.id);
        texto = texto.replace("@Comentario", Documento.comentarios);


        if (Documento.tipoDocumento == "04") {
            texto = texto.replace("FACTURA", "TIQUETE");

        }
        var Cli = Clientes.find(a => a.id == Documento.idCliente);
        texto = texto.replace("@CodCliente", " " + Cli.Codigo);

       
        texto = texto.replace("@NombreCliente", Cli.Nombre);
        texto = texto.replace("@Vendedor", Vendedores.find(a => a.id == $("#selectVendedor").val()).Nombre);


        var tabla = "";

        for (var i = 0; i < Documento.detalle.length; i++) {

            var Prod = Productos.find(a => a.id == Documento.detalle[i].idProducto);
            var Bod = Bodega.find(a => a.id == Prod.idBodega);

            tabla += "<tr>" + "<td colspan='3'>  " + Prod.Codigo + "-" + Prod.Nombre + " - BOD:" + Bod.CodSAP + "  </td></tr>";


            tabla += "<tr>";

            tabla += "<td style='text-align left;'>" + Documento.detalle[i].cantidad + " </td>";

            tabla += "<td style='text-align left;'>" + formatoDecimal(Documento.detalle[i].precioUnitario) + " </td>";
            tabla += "<td style='text-align left;'>" + formatoDecimal(Documento.detalle[i].totalLinea) + " </td>";




            tabla += "</tr>";

        }
        texto = texto.replace("@Tabla", tabla);

        if (Documento.moneda == "CRC") {
            texto = texto.replace("@SubTotal", "₡" + formatoDecimal(Documento.subtotal));
            texto = texto.replace("@TotalDescuento", "₡" + formatoDecimal(Documento.totalDescuento));
            texto = texto.replace("@TotalImpuestos", "₡" + formatoDecimal(Documento.totalImpuestos));
            texto = texto.replace("@Redondeo", "₡" + formatoDecimal(Documento.redondeo));
            texto = texto.replace("@Total", "₡" + formatoDecimal(Documento.totalCompra + Documento.redondeo));
        } else {
            texto = texto.replace("@SubTotal", "$" + formatoDecimal(Documento.subtotal));
            texto = texto.replace("@TotalDescuento", "$" + formatoDecimal(Documento.totalDescuento));
            texto = texto.replace("@TotalImpuestos", "$" + formatoDecimal(Documento.totalImpuestos));
            texto = texto.replace("@Redondeo", "$" + formatoDecimal(Documento.redondeo));
            texto = texto.replace("@Total", "$" + formatoDecimal(Documento.totalCompra + Documento.redondeo));
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


function ImprimirTiqueteC(Documento) {
    try {



        var ventana = window.open('', 'PRINT', 'height=400,width=600');
        var texto = htmlCredito2;
        texto = texto.replace("@Fecha", Documento.fecha.split("T")[0] + " " + Documento.fecha.split("T")[1].substring(0, 8));
        texto = texto.replace("@NumInterno", Documento.id);
        texto = texto.replace("@CodSuc", MiSucursal.CodSuc);
        texto = texto.replace("@NumComprobante", Documento.consecutivoHacienda);
        texto = texto.replace("@NumFactura", Documento.id);
        texto = texto.replace("@Comentario", Documento.comentarios);

        var cond = CP.find(a => a.id == $("#selectCondPago").val());
        texto = texto.replace("@selectCondPago", cond.Nombre);


        if (Documento.tipoDocumento == "04") {
            texto = texto.replace("FACTURA", "TIQUETE");

        }
        var Cli = Clientes.find(a => a.id == Documento.idCliente);
        texto = texto.replace("@CodCliente", " " + Cli.Codigo);

       
        texto = texto.replace("@NombreCliente", Cli.Nombre);
        texto = texto.replace("@Vendedor", Vendedores.find(a => a.id == $("#selectVendedor").val()).Nombre);


        var tabla = "";

        for (var i = 0; i < Documento.detalle.length; i++) {

            var Prod = Productos.find(a => a.id == Documento.detalle[i].idProducto)

            tabla += "<tr>" + "<td colspan='3'>  " + Prod.Codigo + "-" + Prod.Nombre + "  </td></tr>";


            tabla += "<tr>";

            tabla += "<td style='text-align left;'>" + Documento.detalle[i].cantidad + " </td>";

            tabla += "<td style='text-align left;'>" + formatoDecimal(Documento.detalle[i].precioUnitario) + " </td>";
            tabla += "<td style='text-align left;'>" + formatoDecimal(Documento.detalle[i].totalLinea) + " </td>";




            tabla += "</tr>";

        }
        texto = texto.replace("@Tabla", tabla);

        if (Documento.moneda == "CRC") {
            texto = texto.replace("@SubTotal", "₡" + formatoDecimal(Documento.subtotal));
            texto = texto.replace("@TotalDescuento", "₡" + formatoDecimal(Documento.totalDescuento));
            texto = texto.replace("@TotalImpuestos", "₡" + formatoDecimal(Documento.totalImpuestos));
            texto = texto.replace("@Redondeo", "₡" + formatoDecimal(Documento.redondeo));
            texto = texto.replace("@Total", "₡" + formatoDecimal(Documento.totalCompra + Documento.redondeo));
        } else {
            texto = texto.replace("@SubTotal", "$" + formatoDecimal(Documento.subtotal));
            texto = texto.replace("@TotalDescuento", "$" + formatoDecimal(Documento.totalDescuento));
            texto = texto.replace("@TotalImpuestos", "$" + formatoDecimal(Documento.totalImpuestos));
            texto = texto.replace("@Redondeo", "$" + formatoDecimal(Documento.redondeo));
            texto = texto.replace("@Total", "$" + formatoDecimal(Documento.totalCompra + Documento.redondeo));
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


function ImprimirFactura(Documento) {
    try {



        var ventana = window.open('', 'PRINT', 'height=400,width=600');
        var texto = htmlCredito2;
        texto = texto.replace("@Fecha", Documento.fecha.split("T")[0]);
        texto = texto.replace("@NumInterno", Documento.id);
        texto = texto.replace("@CodSuc", MiSucursal.CodSuc);
        texto = texto.replace("@NumComprobante", Documento.claveHacienda);
        texto = texto.replace("@NumFactura", Documento.consecutivoHacienda);



        if (Documento.tipoDocumento == "04") {
            texto = texto.replace("FACTURA", "TIQUETE");

        }
        var Cli = Clientes.find(a => a.id == Documento.idCliente);
        texto = texto.replace("@CodCliente", " " + Cli.Codigo);
        texto = texto.replace("@idCliente", " " + Documento.idCliente);

     
        texto = texto.replace("@NombreCliente", Cli.Nombre);
        texto = texto.replace("@DireccionCliente", Cli.Sennas);

        texto = texto.replace("@Vendedor", Vendedores.find(a => a.id == $("#selectVendedor").val()).Nombre);

        var cond = CP.find(a => a.id == $("#selectCondPago").val());
        texto = texto.replace("@selectCondPago", cond.Nombre);

        texto = texto.replace("@FechaVencimiento", "");
        texto = texto.replace("@NumOrden", "");
        texto = texto.replace("@FechaEnvio", "");
        texto = texto.replace("@TipoCambio", TipoCambio[0].TipoCambio);

        texto = texto.replace("@TotalLetras", NumeroALetras(Documento.totalCompra + Documento.redondeo));






        var tabla = "";

        for (var i = 0; i < Documento.detalle.length; i++) {

            var Prod = Productos.find(a => a.id == Documento.detalle[i].idProducto)

            tabla += "<tr>";
            tabla += "<td align ='center'>" + Documento.detalle[i].cantidad + " </td>";
            tabla += "<td align ='center'>" + Prod.Codigo + " </td>";

            tabla += "<td  align ='center' style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>" + Prod.Nombre + " </td>";
            tabla += "<td  align ='center'>" + formatoDecimal(Documento.detalle[i].precioUnitario) + " </td>";
            tabla += "<td  align ='center'>" + formatoDecimal(Documento.detalle[i].totalLinea) + " </td>";




            tabla += "</tr>";

        }
        texto = texto.replace("@INYECTADO", tabla);

        if (Documento.moneda == "CRC") {
            texto = texto.replace("@SubTotal", "₡" + formatoDecimal(Documento.subtotal));
            texto = texto.replace("@TotalDescuento", "₡" + formatoDecimal(Documento.totalDescuento));
            texto = texto.replace("@TotalImpuestos", "₡" + formatoDecimal(Documento.totalImpuestos));
            texto = texto.replace("@Total", "₡" + formatoDecimal(Documento.totalCompra + Documento.redondeo));
        } else {
            texto = texto.replace("@SubTotal", "$" + formatoDecimal(Documento.subtotal));
            texto = texto.replace("@TotalDescuento", "$" + formatoDecimal(Documento.totalDescuento));
            texto = texto.replace("@TotalImpuestos", "$" + formatoDecimal(Documento.totalImpuestos));
            texto = texto.replace("@Total", "$" + formatoDecimal(Documento.totalCompra + Documento.redondeo));
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

