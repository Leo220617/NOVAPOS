
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
                                        ImprimirTiquete(json.documento);
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

        if (Documento.tipoDocumento == "04") {
            texto = texto.replace("FACTURA", "TIQUETE");

        }
        texto = texto.replace("@CodCliente", " " + Documento.idCliente);

        var Cli = Clientes.find(a => a.id == Documento.idCliente);
        texto = texto.replace("@NombreCliente", Cli.Nombre);
        texto = texto.replace("@Vendedor", "");


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