
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
var TipoCambio = [];
var MetodosPagos = [];
var Documento = [];
var CB = [];
var CP = [];
var Vendedores = [];


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
function ReadOnlyC(){
    try {
        $("#boxC").attr("readonly", "readonly");
        $("#selectCondPago").attr("disabled", "disabled");
        $("#selectMoneda").attr("disabled", "disabled");
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
        TipoCambio = JSON.parse($("#TipoCambio").val());
        Documento = JSON.parse($("#Documento").val());
        CB = JSON.parse($("#CB").val());
        CP = JSON.parse($("#CP").val());
        ExoneracionesCliente = [];

        RellenaClientes();
        RellenaVendedores();

        RellenaExoneraciones();
        maskCedula();
       
        if (Documento != null || Documento != undefined) {
            RecuperarInformacion();
            HideP();
            ReadOnlyC();
            
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
        $("#ClienteSeleccionado").val(Documento.idCliente);
        $("#selectVendedor").val(Documento.idVendedor);
        $("#Fecha").val(Documento.Fecha);

        $("#selectMoneda").val(Documento.Moneda);
        $("#selectTD").val("01");
        $("#selectCondPago").val(Documento.idCondPago);
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
                PorExoneracion: Exoneraciones.find(a => a.id == Documento.Detalle[i].idExoneracion) == undefined ? 0 : Exoneraciones.find(a => a.id == Documento.Detalle[i].idExoneracion).PorExon
            };
            ProdCadena.push(Producto);
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
            var PE = ProdClientes.find(a => a.id == ProdCadena[i].idProducto);
            var ImpuestoTarifa = PE.idImpuesto;
            var IMP = Impuestos.find(a => a.id == ImpuestoTarifa);

            var calculoIMP = IMP.Tarifa;

            ProdCadena[i].Descuento = (ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario) * (ProdCadena[i].PorDescto / 100);
            ProdCadena[i].TotalImpuesto = ((ProdCadena[i].Cantidad * ProdCadena[i].PrecioUnitario) - ProdCadena[i].Descuento) * (calculoIMP / 100);
            //EX => Exoneracion
            var EX = Exoneraciones.find(a => a.id == ProdCadena[i].idExoneracion);
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
            text: 'Ha ocurrido un error al intentar imprimir ' + e

        })
    }

}
function RellenaProductos() {
    try {
        var html = "";
        $("#ProductoSeleccionado").html(html);

        html += "<option value='0' > Seleccione Producto </option>";

        for (var i = 0; i < ProdClientes.length; i++) {
            html += "<option value='" + ProdClientes[i].id + "' > " + ProdClientes[i].Codigo + " - " + ProdClientes[i].Nombre + " -  Precio: " + formatoDecimal(parseFloat(ProdClientes[i].PrecioUnitario).toFixed(2)) + " -  Stock: " + formatoDecimal(parseFloat(ProdClientes[i].Stock).toFixed(2)) + " </option>";
        }



        $("#ProductoSeleccionado").html(html);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al intentar imprimir ' + e

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

        var CondP = CP.filter(a => a.id == Cliente.idCondicionPago);

        //Preguntarle a CP cual es la de 30 dias

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
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }


}
function RellenaCondiciones(CPS) {
    try {
        var valorCondicion = Documento != null || Documento != undefined ? Documento.idCondPago : 0;
        var text = "";
        $("#selectCondPago").html(text);

        var Contado = CP.find(a => a.Nombre == "Contado");



        text += "<option value='" + Contado.id + "'> " + Contado.Nombre + " </option>";


        for (var i = 0; i < CPS.length; i++) {
            if (CPS[i].id != Contado.id) {
                if (valorCondicion == CPS[i].id) {
                    text += "<option selected value='" + CPS[i].id + "'> " + CPS[i].Nombre + " </option>";

                } else {
                    text += "<option value='" + CPS[i].id + "'> " + CPS[i].Nombre + " </option>";

                }

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
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

        })
    }

}
function onChangeProducto() {
    try {
        var idProducto = $("#ProductoSeleccionado").val();

        var Producto = ProdClientes.find(a => a.id == idProducto);

        if (Producto != undefined) {
            $("#inputPrecio").val(parseFloat(Producto.PrecioUnitario));
            $("#inputCabys").val(Producto.Cabys);
            $("#impuesto").val(Producto.idImpuesto);
            $("#MonedaProducto").val(Producto.Moneda);

            ExoneracionxCliente();
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
            text: 'Ha ocurrido un error al intentar recuperar cliente ' + e

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
        }  if (Producto.Cantidad <= 0) {
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
        else {
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
            text: 'Error en: ' + e

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
            text: 'Error en: ' + e

        })
    }


}

//Generar
function Generar() {
    try {


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
                    $("#divProcesando").modal("show");


                    $.ajax({
                        type: 'POST',

                        url: $("#urlGenerar").val(),
                        dataType: 'json',
                        data: { recibidos: EncDocumento },
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
                                            ImprimirFactura(json.documento);

                                        }

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
    var suma = 0;
    for (var i = 0; i < array.length; i++) {
        suma += parseFloat(array[i].Monto);
    }
    return suma;
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
                    $(".TRANSFERENCIADIV").hide();
                    $(".CUENTADIV").hide();

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

function ImprimirTiquete(Documento) {
    try {



        var ventana = window.open('', 'PRINT', 'height=400,width=600');
        var texto = " <!DOCTYPE html><html><body><div style='color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 8pt; margin:0pt; text-indent: 0pt;text-align: left; width: 25%;' ><center><p style='color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 8pt; line-height: 5px; padding-top: 4pt;text-indent: 0pt;'>Nueva Cultura Novagro SA</p><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 8pt; line-height: 5px; padding-top: 4pt; text-indent: 0pt;'>Cedula Juridica: 3-101-376551</p><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 8pt; line-height: 5px; padding-top: 4pt; text-indent: 0pt;'>Telefax: 24731056</p><a style='color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 8pt; '>info@novagrocr.com  </a>&nbsp;&nbsp;<a style='color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 8pt; '>www.novagrocr.com  </a></center><hr> </hr><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt; ' >FECHA FACT: </a>&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;' > @Fecha </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;' >FACTURA </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;' >ELECTRÓNICA </a>&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;' > @NumFactura </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;' >N° INTERNO: <span style='font-weight: bold;'>CO-Pital</span>  <span>@NumInterno</span></a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;' >VENDEDOR:</a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;' >@Vendedor </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;' >COD CLIENTE:</a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;' >@CodCliente </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;' >CLIENTE:</a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt; font-weight: bold;' >@NombreCliente</a><hr> </hr><table><thead ><tr><th>CANT </th><th>NOM</th><th>PRECIO </th><th>TOTAL </th></tr></thead><tbody>@Tabla</tbody></table><hr> </hr><table><tbody><tr><td> <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;' >SUBTOTAL </a></td><td></td><td>  <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;' >@SubTotal </a></td></tr><tr><td> <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;' >DESCUENTO </a></td><td>  </td><td>  <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;' >@TotalDescuento </a></td></tr><tr><td> <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;' >IVA </a></td><td> </td><td>   <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;' >@TotalImpuestos </a></td></tr><tr><td> <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;' >TOTAL </a></td><td> </td><td><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;font-weight: bold;'> @Total</a> </a></td></tr></tbody></table><hr> </hr><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>GRACIAS POR SU COMPRA</p><hr> </hr><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 8pt; font-weight: bold;'>FIRMA Y CEDULA</p><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 8pt; font-weight: bold;'>Comprobante Fiscal:</p><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7pt;' >@NumComprobante</p><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7pt;'>1. Para toda devolución es indispensable la factura</p><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7pt;'>original.</p><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7pt;'> 2. No se aceptan devoluciones si las marcas del  rayados,</p><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7pt;'>fabricante o los  articulos son alterados, quebrados,.</p><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7pt;'>golpeados, desarmados o modificados.</p><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7pt;'>3. Para reclamos se cuenta con 3 días habiles</p><p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7pt;'>4. Factura genera una tasa de mora del 3% mensual.</p><br><p style='color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;'>* Gravado 13% ** Gravado 10% </p><p style='color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;'>Autorizado mediante resolución No</p><p style='color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7.5pt;'>DGT-R-48-2016 del 7 de octubre de 2016.</p></div></body></html>";
        texto = texto.replace("@Fecha", Documento.fecha.split("T")[0]);
        texto = texto.replace("@NumInterno", Documento.id);
        texto = texto.replace("CO-Pital", "");
        texto = texto.replace("@NumComprobante", Documento.consecutivoHacienda);
        texto = texto.replace("@NumFactura", Documento.id);

        

        if (Documento.tipoDocumento == "04") {
            texto = texto.replace("FACTURA", "TIQUETE");

        }
        texto = texto.replace("@CodCliente", " " + Documento.idCliente);

        var Cli = Clientes.find(a => a.id == Documento.idCliente);
        texto = texto.replace("@NombreCliente", Cli.Nombre);
        texto = texto.replace("@Vendedor", Vendedores.find(a => a.id == $("#selectVendedor").val()).Nombre);


        var tabla = "";

        for (var i = 0; i < Documento.detalle.length; i++) {

            var Prod = Productos.find(a => a.id == Documento.detalle[i].idProducto)

            tabla += "<tr>";
            tabla += "<td>" + Documento.detalle[i].cantidad + " </td>";
            tabla += "<td style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>" + Prod.Nombre + " </td>";
            tabla += "<td>" + formatoDecimal(Documento.detalle[i].precioUnitario) + " </td>";
            tabla += "<td>" + formatoDecimal(Documento.detalle[i].totalLinea) + " </td>";




            tabla += "</tr>";

        }
        texto = texto.replace("@Tabla", tabla);

        if (Documento.moneda == "CRC") {
            texto = texto.replace("@SubTotal", "₡" + formatoDecimal(Documento.subtotal));
            texto = texto.replace("@TotalDescuento", "₡" + formatoDecimal(Documento.totalDescuento));
            texto = texto.replace("@TotalImpuestos", "₡" + formatoDecimal(Documento.totalImpuestos));
            texto = texto.replace("@Total", "₡" + formatoDecimal(Documento.totalCompra));
        } else {
            texto = texto.replace("@SubTotal", "$" + formatoDecimal(Documento.subtotal));
            texto = texto.replace("@TotalDescuento", "$" + formatoDecimal(Documento.totalDescuento));
            texto = texto.replace("@TotalImpuestos", "$" + formatoDecimal(Documento.totalImpuestos));
            texto = texto.replace("@Total", "$" + formatoDecimal(Documento.totalCompra));
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
        var texto = "<!DOCTYPE html> <html><body> <div> <img id='base64image' src='data:image/jpeg;base64,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UAHalsAlK7YzxXx3dLdeKb10OVRhGPqqgH9c18vmFqtb+uyPIxcryMCuTSMjGbvE7j4VWbSarc3ZHyRRbAf9pj/gD+derlUG/wCvU7sGtD1KvoL2O2wUDCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoASkkBy3ijxVa6TbyRW8iS3pBCRqc7T6t6Y9K4cTj40Dnq1eU8gd2kdnclnYkknqTXzEruoeW/eLGnWNxqN0lvaRNJK3YdAPUnsKulRdSpYqEb6HtPhrSItE0tLWM7nzukfH3mPU/0/CvrKGHVFaHrUocqNettzS4tMAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDzP4nJcNrFr5JIXyecNjnca8HNU2/68jgxRx3k33rJ/38/+vXlRTscjWghgvWBB3kHtv/8Ar02qr/pAkXrLwxq142ILcY7kyKMfrWsMHWn/AEjRUHI6TTPh1OxDandKi90gGSfxPT8jXfTyvXX+vxNoYJRZ3WkaRZ6Rb+VZQqg/iP8AE31PevYo0VSVjthTUTSrYsKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA//9k=' /> </div> <div> <p style='color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; line-height: 5px; padding-top: 4pt;text-indent: 0pt; font-weight: bold;'> NUEVA AGRICULTURA NOVAGRO SA.</p> <p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; line-height: 5px; padding-top: 4pt; text-indent: 0pt; font-weight: bold;'> Cedula Juridica: 3-101-376551</p> <p style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; line-height: 5px; padding-top: 4pt; text-indent: 0pt; font-weight: bold;'> Telefax: 24731056</p> <p style='color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'> Email: info@novagrocr.com / www.novagrocr.com</p> <p style='color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'> Alajuela, San Carlos, Pital. 400 metros norte de Estación Servicio Pital </p> </div><div style='  position:relative; left:800px; top:-148px; '><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Factura </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Electrónica: </a>&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'> @NumFactura </a><br><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>N° Interno: </a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>@NumInterno</a>&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'> CO-Pital</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>Fecha de emisión:</a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>@Fecha</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>Condición de Pago: </a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'> @selectCondPago</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>Fecha de vencimiento: </a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'> @FechaVencimiento</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>Página:</a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'> 1</a></div> <div style='width: 100%; border: 1px solid black ;  position:relative;  top:-100px;'><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>NOMBRE O RAZÓN </a>&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; '> @NombreCliente </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>SOCIAL: </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>CLIENTE: </a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>@CodCliente </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'> ID CLIENTE: </a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>@idCliente </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'> DIRECCIÓN CLIENTE: </a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>@DireccionCliente </a><br><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>TEL: </a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>24731056</a> </div> <div style=' position:relative; left:800px; top:-220px; '><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Número de Órden </a>&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>@NumOrden</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>de Compra: </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Fecha de envío de </a>&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>@FechaEnvio</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>mercadería: </a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Vendedor:</a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>@Vendedor</a> </div> <div style='-ms-flex: 1 1 auto;flex: 1 1 auto;border-radius: 0 0 10px 10px; '> <table style='border-bottom-width: 1px;  width: 100%; position:relative;  top:-150px; '> <thead style=' background-color: #74BA3E !important;'> <tr style='font-size: 30px;'> <th> Cantidad </th> <th>Codigo</th> <th>Descripción </th> <th>Precio Unitario </th> <th>Precio Total </th> </tr> </thead> <tbody style='font-size: 20px;  '> @INYECTADO </tbody> </table> </div><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Tipo de cambio:</a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; '>@TipoCambio</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Total en letras:</a>&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>@TotalLetras</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Observaciones</a><br><br><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Comprobante Fiscal:</a>&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; '>@NumComprobante</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Condiciones:</a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;  position:relative; left:800px; '>Autorizados de Crédito:</a><br><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; '>1. Esta factura devengará intereses del 3% mensual después de su vencimiento.</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; '>2. De conformidad con el artículo 460 del código comercial, esta factura constituye título ejecutivo renuncia de requerimiento</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; '>domicilio, la suma se presume cierta y las firmas que la cubren auténticas.</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; '>3. La mercadería se entregará a quien firma esta factura en donde acepta la misma que tiene autorización para ello y en ese</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; '>acto es representante para el comprador.</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold; '>4. Los pagos se pueden realizar en cualquiera de nuestras sucursales en cajas o en cuentas corrientes</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold; '>número:</a><br> <div style='position:relative; left:60px; '><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold; '>- BANCO DE COSTA RICA DOLARES: 345-0001474-5 CC15201345000147451</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold; '>- BANCO DE COSTA RICA COLONES: 345-0001281-5 CC15201345000128152</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold; '>- BANCO NACIONAL DE COSTA RICA DOLARES: 100-02-058-600081-9 CC15105810026000819</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold; '>- BANCO NACIONAL DE COSTA RICA COLONES: 100-01-092-000459-7 CC15109210010004595</a><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>**Gravado 10%</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>**Gravado 10%</a></div><br><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>Cliente:</a>&nbsp;&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt;'>Acepto y reconozco como obligatorias las condiciones específicas de esta factura.</a><br><br><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Nombre:</a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>______________________________</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Cedula:</a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>______________________________</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>Firma:</a><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; font-weight: bold;'>______________________________</a> <div style='width: 25%; border: 1px solid black ;  position:relative;  top:-600px; left:750px;'> <table> <tbody> <tr> <td> <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt; font-weight: bold;'>Subtotal Gravado </a></td> <td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td> <td> <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>@SubTotal </a></td> </tr> <tr></tr> </tbody> </table> <table> <tbody> <tr> <td> <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>Subtotal Exento: </a></td> <td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </td> <td> <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>CRC 0.00 </a></td> </tr> <tr></tr> </tbody> </table> <table> <tbody> <tr> <td> <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>Impuesto </a></td> <td>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td> <td> <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;'>@TotalImpuestos </a></td> </tr> <tr></tr> </tbody> </table> <table> <tbody> <tr> <td> <a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt; '>TOTAL </a></td> <td>&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </td> <td><a style=' color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 9pt;font-weight: bold;'> @Total</a> </a></td> </tr> <tr></tr> </tbody> </table> </div> </body></html> <style></style>";
        texto = texto.replace("@Fecha", Documento.fecha.split("T")[0]);
        texto = texto.replace("@NumInterno", Documento.id);
        texto = texto.replace("CO-Pital", "");
        texto = texto.replace("@NumComprobante", Documento.claveHacienda);
        texto = texto.replace("@NumFactura", Documento.consecutivoHacienda);



        if (Documento.tipoDocumento == "04") {
            texto = texto.replace("FACTURA", "TIQUETE");

        }
        texto = texto.replace("@CodCliente", " " + Documento.idCliente);
        texto = texto.replace("@idCliente", " " + Documento.idCliente);

        var Cli = Clientes.find(a => a.id == Documento.idCliente);
        texto = texto.replace("@NombreCliente", Cli.Nombre);
        texto = texto.replace("@DireccionCliente", Cli.Sennas);

        texto = texto.replace("@Vendedor", Vendedores.find(a => a.id == $("#selectVendedor").val()).Nombre);

       var cond = CP.find(a => a.id == $("#selectCondPago").val());
        texto = texto.replace("@selectCondPago", cond.Nombre);

        texto = texto.replace("@FechaVencimiento", "");
        texto = texto.replace("@NumOrden", "");
        texto = texto.replace("@FechaEnvio", "");
        texto = texto.replace("@TipoCambio", TipoCambio[0].TipoCambio);

        texto = texto.replace("@TotalLetras", NumeroALetras(Documento.totalCompra));
        
        
        

        

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
            texto = texto.replace("@Total", "₡" + formatoDecimal(Documento.totalCompra));
        } else {
            texto = texto.replace("@SubTotal", "$" + formatoDecimal(Documento.subtotal));
            texto = texto.replace("@TotalDescuento", "$" + formatoDecimal(Documento.totalDescuento));
            texto = texto.replace("@TotalImpuestos", "$" + formatoDecimal(Documento.totalImpuestos));
            texto = texto.replace("@Total", "$" + formatoDecimal(Documento.totalCompra));
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