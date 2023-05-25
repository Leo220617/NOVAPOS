
$(document).ready(function () {
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
var Oferta = [];
var TipoCambio = [];
var CP = [];
var Vendedores = [];
var DES = [];
var Bodega = [];
var Sucursal = [];


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
        Oferta = JSON.parse($("#Oferta").val());
        TipoCambio = JSON.parse($("#TipoCambio").val());
        CP = JSON.parse($("#CP").val());
        DES = JSON.parse($("#DES").val());
        Bodega = JSON.parse($("#Bodega").val());
        Sucursal = JSON.parse($("#Sucursal").val());
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
        $("#descuento").text(formatoDecimal(Oferta.PorDescto.toFixed(2)));

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
                idExoneracion: Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion) == undefined ? 0 : Exoneraciones.find(a => a.id == Oferta.Detalle[i].idExoneracion).id

            };
            ProdCadena.push(Producto);
        }
        RellenaTabla();
        onChangeCliente();
        $("#selectCondPago").val(Oferta.idCondPago);


    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

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

        $("#selectCondPago").attr("disabled", "disabled");


        var Cliente = Clientes.find(a => a.id == idCliente);
        var CondP = CP.filter(a => a.id == Cliente.idCondicionPago);
        var Contado = CP.find(a => a.Nombre == "Contado");

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
        $("#strongInfo2").text("Saldo: " + formatoDecimal(Cliente.Saldo.toFixed(2)) + " " + "  " + " " + "  " + "Limite Credito: " + formatoDecimal(Cliente.LimiteCredito.toFixed(2)));

        if (Cliente.LimiteCredito <= 0 && Cliente.idCondicionPago != Contado.id) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Limite de crédito excedido'

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

                } else if (result.length > 0) {
                    console.log(result);
                    $("#selectCondPago").attr("disabled", "disabled");
                    var textoF = "";
                    for (var i = 0; i < result.length; i++) {
                        textoF += " " + result[i].docNum + ", ";
                    }

                    Swal.fire({
                        icon: 'warning',
                        title: 'Advertencia...',
                        text: 'El Cliente tiene las siguientes facturas pendientes: ' + textoF + " por lo tanto se bloquea el crédito"

                    })
                } else {
                    $("#selectCondPago").attr("disabled", false);
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
            var TotalGanancia = (ProdCadena[i].TotalLinea - ProdCadena[i].TotalImpuesto);
            var MonedaDoc = $("#selectMoneda").val();
            var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
            html += "<tr>";

            html += "<td> " + (i + 1) + " </td>";

            html += "<td > " + ProdCadena[i].Descripcion + " </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeCantidadProducto(" + i + ")' type='number' id='" + i + "_Prod' class='form-control'   value= '" + formatoDecimal(parseFloat(ProdCadena[i].Cantidad).toFixed(2)) + "' min='1'/>  </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangePrecioProducto(" + i + ")' type='number' id='" + i + "_Prod3' class='form-control'   value= '" + parseFloat(ProdCadena[i].PrecioUnitario).toFixed(2) + "' min='1'/> </td>";
            html += "<td class='text-center'> <input onchange='javascript: onChangeDescuentoProducto(" + i + ")' type='number' id='" + i + "_Prod2' class='form-control'   value= '" + formatoDecimal(parseFloat(ProdCadena[i].PorDescto).toFixed(2)) + "' min='1'/>  </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].Descuento).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].TotalImpuesto).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].PorExoneracion).toFixed(2)) + " </td>";
            html += "<td class='text-right'> " + formatoDecimal(parseFloat(ProdCadena[i].TotalLinea).toFixed(2)) + " </td>";
            if ($("#RolGanancia").val() == "value") {
                if (ProdCadena[i].Moneda != MonedaDoc) {
                    if (ProdCadena[i].Moneda != "CRC") {
                        var Costo = ProdCadena[i].Costo;
                        if (retornaMargenGanancia(TotalGanancia, Costo) > 0) {
                            html += "<td class='text-right' style='background-color:  #EFFFE9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                        else {
                            html += "<td class='text-right' style='background-color:#FFE9E9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }

                    } else {
                        var Costo = ProdCadena[i].Costo / TipodeCambio.TipoCambio;
                        if (retornaMargenGanancia(TotalGanancia, Costo) > 0) {
                            html += "<td class='text-right' style='background-color:  #EFFFE9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        } else {
                            html += "<td class='text-right' style='background-color:#FFE9E9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                    }

                }
                else {
                    if (ProdCadena[i].Moneda != "CRC") {
                        var Costo = ProdCadena[i].Costo / TipodeCambio.TipoCambio;
                        if (retornaMargenGanancia(TotalGanancia, Costo) > 0) {
                            html += "<td class='text-right' style='background-color:  #EFFFE9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                        else {
                            html += "<td class='text-right' style='background-color:#FFE9E9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                    } else {
                        var Costo = ProdCadena[i].Costo;
                        if (retornaMargenGanancia(TotalGanancia, Costo) > 0) {
                            html += "<td class='text-right' style='background-color:  #EFFFE9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                        else {
                            html += "<td class='text-right' style='background-color:#FFE9E9'> " + formatoDecimal(retornaMargenGanancia(TotalGanancia, Costo).toFixed(2)) + "%" + " </td>";
                        }
                    }
                }

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


function AgregarProductoTabla() {
    try {
        var subtotalG = parseFloat(ReplaceLetra($("#subG").text()));
        var impuestoG = parseFloat(ReplaceLetra($("#impG").text()));
        var descuentoG = parseFloat(ReplaceLetra($("#descG").text()));
        var totalG = parseFloat(ReplaceLetra($("#totG").text()));

        var id = $("#ProductoSeleccionado").val();
        var id = $("#ProductoSeleccionado").val();
        var PE = ProdClientes.find(a => a.id == id);



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
            NomPro: $("#inputNomPro").val(),
            idExoneracion: $("#exoneracion").val(),
            PorExoneracion: 0,
            Costo: PE.Costo
        };

        var Descuento = parseFloat($("#DES").val());


        if (PE.PrecioUnitario > Producto.PrecioUnitario && PE.Editable == false) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor o igual a ' + ' ' + PE.PrecioUnitario

            })



        }
        if (Producto.PrecioUnitario <= 0 && PE.Editable == true) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor  a 0'

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

        if (Producto.PorDescto > Descuento) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Usted no puede aplicar este descuento, el descuento máximo asignado a su usuario es de' + ' ' + parseFloat(Descuento).toFixed(2) + '%'

            })

        } else if (Producto.Cantidad > 0 && Producto.PorDescto >= 0 && Producto.PorDescto <= Descuento && (PE.PrecioUnitario <= Producto.PrecioUnitario) || (PE.Editable == true && Producto.Cantidad > 0 && Producto.PrecioUnitario > 0)) {

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
            TotalCompra: parseFloat(ReplaceLetra($("#totG").text())),
            PorDescto: parseFloat(ReplaceLetra($("#descuento").val())),
            CodSuc: "",
            Moneda: $("#selectMoneda").val(),
            idCondPago: $("#selectCondPago").val(),
            TipoDocumento: $("#selectTD").val(),
            Detalle: ProdCadena
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
                                    text: 'Ha ocurrido un error al intentar guardar'

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
        var idCliente = $("#ClienteSeleccionado").val();
        var totalG = parseFloat(ReplaceLetra($("#totG").text()));

        var Cliente = Clientes.find(a => a.id == idCliente);
        var TipodeCambio = TipoCambio.find(a => a.Moneda == "USD");
        var CondPago = $("#selectCondPago").val();

        if ($("#selectMoneda").val() != "CRC") {
            totalG = totalG * TipodeCambio.TipoCambio;
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


            else {
                return true;
            }
        } if (Cliente.LimiteCredito < totalG && CondPago != Contado.id) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El total de la factura es mayor al Limite de crédito'

            })
            return false;
        } else {
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

        if (ProdCadena[i].PorDescto >= 0 && ProdCadena[i].PorDescto <= Descuento) {
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
        }
        if (ProdCadena[i].PorDescto > Descuento) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Usted no puede aplicar este descuento, el descuento máximo asignado a su usuario es de' + ' ' + parseFloat(Descuento).toFixed(2) + '%'

            })
            ProdCadena[i].PorDescto = 0;
            ValidarTotales();
        }

    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en: ' + e

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
        }
        else if (PE.PrecioUnitario > ProdCadena[i].PrecioUnitario && PE.Editable == false) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor o igual a ' + ' ' + PE.PrecioUnitario

            })
            ProdCadena[i].PrecioUnitario = PE.PrecioUnitario;
            ValidarTotales();

        } else if (PE.Editable == true && ProdCadena[i].PrecioUnitario <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Precio invalido, el precio tiene que ser mayor a 0'

            })
            ProdCadena[i].PrecioUnitario = 1;
            ValidarTotales();

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