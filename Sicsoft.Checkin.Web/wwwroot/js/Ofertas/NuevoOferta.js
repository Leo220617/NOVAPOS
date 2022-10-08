 
    $(document).ready(function() {
        jQuery(document).ready(function ($) {
            Recuperar();
        });



    $(document).ready(function() {

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
var TipoCambio = [];

    function Recuperar() {
        Cantones = JSON.parse($("#Cantones").val());
    Distritos = JSON.parse($("#Distritos").val());
    Barrios = JSON.parse($("#Barrios").val());
    Clientes = JSON.parse($("#Clientes").val());
    Productos = JSON.parse($("#Productos").val());
    Impuestos = JSON.parse($("#Impuestos").val());
        Exoneraciones = JSON.parse($("#Exoneraciones").val());
        TipoCambio = JSON.parse($("#TipoCambio").val());

        ExoneracionesCliente = [];

    RellenaClientes();
    RellenaExoneraciones();
    maskCedula();
        }
    function RellenaClientes() {
            var html = "";
    $("#ClienteSeleccionado").html(html);
    html += "<option value='0' > Seleccione Cliente </option>";

    for (var i = 0; i < Clientes.length; i++) {
        html += "<option value='" + Clientes[i].id + "' > " + Clientes[i].Codigo + " - " + Clientes[i].Nombre + " </option>";
            }



    $("#ClienteSeleccionado").html(html);
        }
    function RellenaProductos() {

            var html = "";
    $("#ProductoSeleccionado").html(html);

    html += "<option value='0' > Seleccione Producto </option>";

    for (var i = 0; i < ProdClientes.length; i++) {
        html += "<option value='" + ProdClientes[i].id + "' > " + ProdClientes[i].Codigo + " - " + ProdClientes[i].Nombre + " -  Precio: " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " -  Stock: " + formatoDecimal(parseFloat(ProdClientes[i].Stock).toFixed(2)) + " </option>";
            }



    $("#ProductoSeleccionado").html(html);
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
            var idCliente = $("#ClienteSeleccionado").val();

            var Cliente = Clientes.find(a => a.id == idCliente);

    $("#spanDireccion").text(Cliente.Sennas);
    $("#strongInfo").text("Phone: " + Cliente.Telefono + " " + "  " + " " + "  " + "Email: " + Cliente.Email);

            ProdClientes = Productos.filter(a => a.idListaPrecios == Cliente.idListaPrecios);
        RellenaProductos();
     
        }

function ExoneracionxCliente() {
    var idCliente = $("#ClienteSeleccionado").val();
    ExoneracionesCliente = Exoneraciones.filter(a => a.idCliente == idCliente && a.Activo == true);

    RellenaExoneraciones();
}
    function onChangeProducto() {
            var idProducto = $("#ProductoSeleccionado").val();

            var Producto = ProdClientes.find(a => a.id == idProducto);

    if (Producto != undefined) {
        $("#inputPrecio").val(parseFloat(Producto.PrecioUnitario));
    $("#inputCabys").val(Producto.Cabys);
        $("#impuesto").val(Producto.idImpuesto);
        ExoneracionxCliente();
            } else {
        $("#inputPrecio").val(0);
    $("#inputCabys").val("");
    $("#impuesto").val(0);
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
            if (cliente.idListaPrecios == "" || cliente.idListaPrecios == null) {
                return false;
            } else if (cliente.Nombre == "" || cliente.Nombre == null) {
                return false;
            }
    else if (cliente.Cedula == "" || cliente.Cedula == null) {
                return false;


            }  else if (cliente.Email == "" || cliente.Email == null) {
                return false;

            } else if (cliente.Telefono == "" || cliente.Telefono == null) {
                return false;

            } else if (cliente.Sennas == "" || cliente.Sennas == null) {
                return false;

            }  else if (cliente.CorreoPublicitario == "" || cliente.CorreoPublicitario == null) {
                return false;

            }  else if (cliente.idGrupo == "" || cliente.idGrupo == null) {
                return false;
            }

    else {
                return true;
            }
        }

    function LimpiarDatosCliente() {
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
        }

    //Agregar Cliente
    function AgregarCliente() {
            try {
                var Cliente =
    {
        id: 0,
    Codigo: "",
    idListaPrecios: $("#idListaP").val(),
    Nombre:  $("#Nombre").val(),
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
    }else
    {
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


function AgregarProductoTabla() {

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

        $("#ProductoSeleccionado").val("0").trigger('change.select2');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Producto sin Cabys valido'

        })
    }







}

function EliminarProducto(i) {

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
}

//Generar
function Generar() {
    try {


        var EncOferta = {
            id: 0,
            idCliente: $("#ClienteSeleccionado").val(),
            idUsuarioCreador: 0,
            Fecha: $("#Fecha").val(),
            FechaVencimiento: $("#fechaVencimiento").val(),
            Comentarios: $("#inputComentarios").val(),
            Subtotal: parseFloat(ReplaceLetra($("#subG").text())),
            TotalImpuestos: parseFloat(ReplaceLetra($("#impG").text())),
            TotalDescuento: parseFloat(ReplaceLetra($("#descG").text())),
            TotalCompra: parseFloat(ReplaceLetra($("#totG").text())),
            PorDescto: parseFloat(ReplaceLetra($("#descuento").val())),
            CodSuc: "",
            Moneda: $("#selectMoneda").val(),
            Detalle: ProdCadena
        }

        if (validarOferta(EncOferta)) {
            Swal.fire({
                title: '¿Desea guardar la oferta?',
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


                            console.log("resultado " + json.Oferta);
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

                                        window.location.href = window.location.href.split("/Nuevo")[0];


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
    if (e.idCliente == "0" || e.idCliente == null) {
        return false;
    } else if (e.FechaVencimiento == "" || e.FechaVencimiento == null) {
        return false;
    }
    else if (e.Detalle.length == 0 || e.Detalle == null) {
        return false;
    }

    else {
        return true;
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