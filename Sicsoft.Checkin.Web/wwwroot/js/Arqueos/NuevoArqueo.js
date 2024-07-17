$(document).ready(function () {
    jQuery(document).ready(function ($) {
        Recuperar();
    });



    $(document).ready(function () {

    });


});

var Bodegas = []; // variables globales
var ProdClientes = [];
var ProdCadena = [];
var ProdPrueba = [];
var Categorias = [];
var Duplicado = false;
var Fechabool = false;

function Recuperar() {
    try {


        Bodegas = JSON.parse($("#Bodegas").val());
        Productos = JSON.parse($("#Productos").val());
        Categorias = JSON.parse($("#Categorias").val());

        RellenaBodegas()
        RellenaCategorias()





    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar ' + e.stack

        })
    }

}

function RellenaCategorias() {
    try {
        var html = "";
        $("#CategoriaSeleccionado").html(html);
        html += "<option value='0' > Seleccione Categoria </option>";

        for (var i = 0; i < Categorias.length; i++) {
            html += "<option value='" + Categorias[i].id + "' > " + Categorias[i].CodSAP + " - " + Categorias[i].Nombre + " </option>";
        }



        $("#CategoriaSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}


function RellenaBodegas() {
    try {
        var html = "";
        $("#BodegaSeleccionado").html(html);
        html += "<option value='0' > Seleccione Bodega </option>";

        for (var i = 0; i < Bodegas.length; i++) {
            html += "<option value='" + Bodegas[i].id + "' > " + Bodegas[i].CodSAP + " - " + Bodegas[i].Nombre + " </option>";
        }



        $("#BodegaSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error ' + e

        })
    }

}

function onChangeCategoria() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idBodega = $("#BodegaSeleccionado").val();

        var Categoria = Categorias.find(a => a.id == idCategoria);
        var Moneda = $("#MonedaSeleccionado").val();


        if (idCategoria != 0 && idBodega != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idBodega == idBodega);
            RellenaProductos();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idBodega == 0);
            RellenaProductos();
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }


}

function onChangeBodega() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idBodega = $("#BodegaSeleccionado").val();





        if (idCategoria != 0 && idListaPrecio != 0) {
            ProdClientes = Productos.filter(a => a.idCategoria == idCategoria && a.idBodega == idBodega );

            RellenaProductos();
        } else {
            ProdClientes = Productos.filter(a => a.idCategoria == 0 && a.idBodega == 0);
            RellenaProductos();
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }
}


function onChangeCobertura(i) {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idListaPrecio = $("#ListaSeleccionado").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var Moneda = $("#MonedaSeleccionado").val();
        var Cobertura = $("#Cobertura").val();
        var Margen = $("#Margen").val();
        var MargenMin = $("#MargenMin").val();

        var CoberturaL = $("#" + i + "_Cobertura").val();
        var MargenL = $("#" + i + "_Margen").val();
        var MargenMinL = $("#" + i + "_MargenMin").val();

        var Existe = ProdCadena.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);

        var x = ProdCadena.findIndex(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);

        var PE = ProdClientes[i];
        var Ganancia = 0;
        var input = $("#" + i + "_Ganancia");

        if (Existe == undefined) {
            if (CoberturaL != Cobertura || MargenL != Margen || MargenMinL != MargenMin) {






                var Producto =
                {




                    ItemCode: PE.Codigo,
                    idListaPrecio: parseFloat($("#ListaSeleccionado").val()),
                    idCategoria: PE.idCategoria,
                    Moneda: PE.Moneda,
                    PrecioSAP: PE.PrecioUnitario,
                    Cobertura: parseFloat($("#" + i + "_Cobertura").val()),
                    Margen: parseFloat($("#" + i + "_Margen").val()),
                    MargenMin: parseFloat($("#" + i + "_MargenMin").val()),
                    PrecioFinal: 0,
                    PrecioCob: 0,
                    PrecioMin: 0,
                    Seteable: $("#" + i + "_mdcheckbox").prop('checked')


                };


                Producto.PrecioCob = PE.Costo / (1 - (Producto.Cobertura / 100));
                Producto.PrecioFinal = Producto.PrecioCob / (1 - (Producto.Margen / 100));
                Producto.PrecioMin = Producto.PrecioCob / (1 - (Producto.MargenMin / 100));


                var PrecioImp = Producto.PrecioFinal * 1.13;



                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(Producto.PrecioFinal).toFixed(2)));
                $("#" + i + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(Producto.PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(Producto.PrecioMin).toFixed(2)));
                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }

                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
                ProdCadena.push(Producto);
            } else {
                ProdCadena.splice(i, 1);
            }
        } else {
            if (CoberturaL != Cobertura || MargenL != Margen || MargenMinL != MargenMin) {



                ProdCadena[x].Margen = parseFloat($("#" + i + "_Margen").val());
                ProdCadena[x].Cobertura = parseFloat($("#" + i + "_Cobertura").val());
                ProdCadena[x].MargenMin = parseFloat($("#" + i + "_MargenMin").val());
                ProdCadena[x].PrecioCob = PE.Costo / (1 - (ProdCadena[x].Cobertura / 100));
                ProdCadena[x].PrecioFinal = ProdCadena[x].PrecioCob / (1 - (ProdCadena[x].Margen / 100));
                ProdCadena[x].PrecioMin = ProdCadena[x].PrecioCob / (1 - (ProdCadena[x].MargenMin / 100));

                var PrecioImp = ProdCadena[x].PrecioFinal * 1.13;


                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioFinal).toFixed(2)));
                $("#" + i + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioMin).toFixed(2)));

                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(ProdCadena[x].PrecioFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(ProdCadena[x].PrecioFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }


                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }


            } else {
                if (Moneda == "CRC") {
                    var Margen = parseFloat($("#" + i + "_Margen").val());
                    var PrecFinal = PE.PrecioUnitario * Margen;
                    Ganancia = retornaMargenGanancia(PrecFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(PrecFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }


                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
                ProdCadena.splice(x, 1);
                Setear()
            }

        }
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }
}

function RellenaProductos() {
    try {
        var idCategoria = $("#CategoriaSeleccionado").val();

        var idBodega = $("#BodegaSeleccionado").val();


        if (idCategoria != 0 && idBodega != 0) {
            RellenaTabla();
        }


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

        var idBodega = $("#BodegaSeleccionado").val();
        var Bodega = Bodegas.find(a => a.id == idBodega);

        $("#tbody").html(html);


        for (var i = 0; i < ProdClientes.length; i++) {
            html += "<tr>";

         
            html += "<td > " + ProdClientes[i].Codigo + "-" + ProdClientes[i].Nombre + " </td>";


            html += "<td > " + Bodega.CodSAP  + " </td>";


            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdClientes[i].Stock).toFixed(2)) + " </td>";

            html += "<td class='text-center'>  <input type='checkbox' id='" + i + "_mdcheckbox' class='chk-col-green' onchange='javascript: onChangeRevisado(" + i + ")'>  <label for='" + i + "_mdcheckbox'></label> </td> ";

            html += "<td class='text-center'> <input onchange='javascript: onChangeCantidad(" + i + ")' type='number' id='" + i + "_Cantidad' class='form-control'   value= '0' min='1'/>  </td>";
            html += "<td class='text-center' id='" + i + "_Diferencia'> 0 </td>";






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
function onChangeRevisado(i) {
    try {


        var idCategoria = $("#CategoriaSeleccionado").val();
        var idListaPrecio = $("#ListaSeleccionado").val();
        var Moneda = $("#MonedaSeleccionado").val();
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");

        var valorCheck = $("#" + i + "_mdcheckbox").prop('checked');

        if (valorCheck == true) {
            var Existe = ProdCadena.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            var x = ProdCadena.findIndex(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            var input = $("#" + i + "_Ganancia");
            var PE = ProdClientes[i];
            if (Existe == undefined) {

                var Producto =
                {




                    ItemCode: PE.Codigo,
                    idListaPrecio: parseFloat($("#ListaSeleccionado").val()),
                    idCategoria: PE.idCategoria,
                    Moneda: PE.Moneda,
                    PrecioSAP: PE.PrecioUnitario,
                    Cobertura: parseFloat($("#" + i + "_Cobertura").val()),
                    Margen: parseFloat($("#" + i + "_Margen").val()),
                    MargenMin: parseFloat($("#" + i + "_MargenMin").val()),
                    PrecioFinal: 0,
                    PrecioCob: 0,
                    PrecioMin: 0,
                    Seteable: $("#" + i + "_mdcheckbox").prop('checked')


                };


                Producto.PrecioCob = PE.Costo / (1 - (Producto.Cobertura / 100));
                Producto.PrecioFinal = Producto.PrecioCob / (1 - (Producto.Margen / 100));
                Producto.PrecioMin = Producto.PrecioCob / (1 - (Producto.MargenMin / 100));


                var PrecioImp = Producto.PrecioFinal * 1.13;



                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(Producto.PrecioFinal).toFixed(2)));
                $("#" + i + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(Producto.PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(Producto.PrecioMin).toFixed(2)));
                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(Producto.PrecioFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }

                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }
                ProdCadena.push(Producto);
            } else {
                ProdCadena[x].Margen = parseFloat($("#" + i + "_Margen").val());
                ProdCadena[x].Cobertura = parseFloat($("#" + i + "_Cobertura").val());
                ProdCadena[x].MargenMin = parseFloat($("#" + i + "_MargenMin").val());
                ProdCadena[x].PrecioCob = PE.Costo / (1 - (ProdCadena[x].Cobertura / 100));
                ProdCadena[x].PrecioFinal = ProdCadena[x].PrecioCob / (1 - (ProdCadena[x].Margen / 100));
                ProdCadena[x].PrecioMin = ProdCadena[x].PrecioCob / (1 - (ProdCadena[x].MargenMin / 100));

                var PrecioImp = ProdCadena[x].PrecioFinal * 1.13;


                $("#" + i + "_PrecioFinal").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioFinal).toFixed(2)));
                $("#" + i + "_PrecioImp").text(formatoDecimal(parseFloat(PrecioImp).toFixed(2)));
                $("#" + i + "_PrecioCob").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioCob).toFixed(2)));
                $("#" + i + "_PrecioMin").text(formatoDecimal(parseFloat(ProdCadena[x].PrecioMin).toFixed(2)));

                if (Moneda == "CRC") {
                    Ganancia = retornaMargenGanancia(ProdCadena[x].PrecioFinal, PE.Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                } else {
                    var Costo = PE.Costo / TipodeCambio.TipoCambio;
                    Ganancia = retornaMargenGanancia(ProdCadena[x].PrecioFinal, Costo);
                    $("#" + i + "_Ganancia").text(formatoDecimal(parseFloat(Ganancia).toFixed(2)));
                }


                if (Ganancia > 0) {
                    input.css('background-color', '#EFFFE9')
                } else {
                    input.css('background-color', '#FFE9E9')
                }

            }
        }
        else {
            var Existe = ProdCadena.find(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            var x = ProdCadena.findIndex(a => a.ItemCode == ProdClientes[i].Codigo && a.idCategoria == idCategoria && a.idListaPrecio == idListaPrecio && a.Moneda == Moneda);
            if (ProdCadena[x].Cobertura == Cobertura && ProdCadena[x].Margen == Margen && ProdCadena[x].MargenMin == MargenMin && Existe != undefined) {



                ProdCadena.splice(x, 1);
            }
        }


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e

        });
    }

}


function Generar() {

    try {

        var EncMargenes = {

            idListaPrecio: $("#ListaSeleccionado").val(),
            idCategoria: $("#CategoriaSeleccionado").val(),
            Moneda: $("#MonedaSeleccionado").val(),
            Cobertura: parseFloat($("#Cobertura").val()),
            Margen: parseFloat($("#Margen").val()),
            MargenMin: parseFloat($("#MargenMin").val()),
            idUsuarioCreador: 0,
            FechaCreacion: $("#Fecha").val(),

            Detalle: ProdCadena
        }

        if (validarMargen(EncMargenes)) {
            Swal.fire({
                title: '¿Desea guardar el Margen?',
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
                    var jsonString = JSON.stringify(EncMargenes);
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


                            console.log("resultado " + json.margen);
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
                                    text: 'Ha ocurrido un error al intentar guardar ' + json.listaX

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

function validarMargen(e) {
    try {



        if (e.idListaPrecio == "" || e.idListaPrecio == null || e.idListaPrecio == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Lista de Precios'

            })
            return false;
        }
        else if (e.idCategoria == "" || e.idCategoria == null || e.idCategoria == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Categoria'

            })
            return false;
        }
        else if (e.Moneda == "" || e.Moneda == null || e.Moneda == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, falta la Moneda'

            })
            return false;
        }
        else if (e.Cobertura == "" || e.Cobertura == null || e.Cobertura <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, Cobertura invalida'

            })
            return false;
        }

        else if (e.Margen == "" || e.Margen == null || e.Margen <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, Margen invalido'

            })
            return false;
        }

        else if (e.MargenMin == "" || e.MargenMin == null || e.MargenMin <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error al intentar agregar, Margen Minimo invalido'

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


function filtrarTabla() {
    var busqueda = $("#busqueda").val().toLowerCase();
    var filas = $("#tbody tr");
    var indicesVisibles = [];

    filas.each(function (index) {
        var descripcion = $(this).find("td:eq(0s)").text().toLowerCase();

        if (descripcion.includes(busqueda)) {
            $(this).show();
            indicesVisibles.push(index);
        } else {
            $(this).hide();
        }
    });

    return indicesVisibles;
}





