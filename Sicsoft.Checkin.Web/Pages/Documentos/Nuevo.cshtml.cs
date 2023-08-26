using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;


namespace NOVAAPP.Pages.Documentos
{
    public class NuevoModel : PageModel
    {
        private readonly ICrudApi<DocumentosViewModel, int> service; //API
        private readonly ICrudApi<ImpuestosViewModel, int> serviceU;
        private readonly ICrudApi<ClientesViewModel, string> clientes;
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<CantonesViewModel, int> serviceC;
        private readonly ICrudApi<DistritosViewModel, int> serviceD;
        private readonly ICrudApi<BarriosViewModel, int> serviceB;
        private readonly ICrudApi<ListaPreciosViewModel, int> precio;
        private readonly ICrudApi<ExoneracionesViewModel, int> exo;
        private readonly ICrudApi<GruposClientesViewModel, int> grupo;
        private readonly ICrudApi<TipoCambiosViewModel, int> tipoCambio;
        private readonly ICrudApi<OfertasViewModel, int> serviceO; //API
        private readonly ICrudApi<CuentasBancariasViewModel, int> serviceCB; //API
        private readonly ICrudApi<CondicionesPagosViewModel, int> serviceCP; //API
        private readonly ICrudApi<VendedoresViewModel, int> vendedor;
        private readonly ICrudApi<UsuariosViewModel, int> usuario;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<DocumentosCreditoViewModel, int> documentos;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<SeriesProductosViewModel, int> series;






        [BindProperty]
        public DocumentosViewModel Documento { get; set; }

        [BindProperty]
        public ImpuestosViewModel[] Impuestos { get; set; }
        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }
        [BindProperty]
        public CantonesViewModel[] Cantones { get; set; }

        [BindProperty]
        public DistritosViewModel[] Distritos { get; set; }

        [BindProperty]
        public BarriosViewModel[] Barrios { get; set; }
        [BindProperty]
        public ListaPreciosViewModel[] PrecioLista { get; set; }

        [BindProperty]
        public ExoneracionesViewModel[] Exoneraciones { get; set; }

        [BindProperty]
        public GruposClientesViewModel[] Grupos { get; set; }
        [BindProperty]
        public TipoCambiosViewModel[] TP { get; set; }

        [BindProperty]
        public CuentasBancariasViewModel[] CB { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel[] CP { get; set; }

        [BindProperty]
        public VendedoresViewModel[] Vendedores { get; set; }

        [BindProperty]
        public UsuariosViewModel DES { get; set; }


        [BindProperty]
        public decimal Descuento { get; set; }
        [BindProperty]
        public BodegasViewModel[] Bodega { get; set; }

        [BindProperty]
        public DocumentosCreditoViewModel[] DocumentosC { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursal { get; set; }

        [BindProperty]
        public SucursalesViewModel MiSucursal { get; set; }


        [BindProperty]
        public SeriesProductosViewModel SeriesProductos { get; set; }


        public NuevoModel(ICrudApi<DocumentosViewModel, int> service, ICrudApi<ImpuestosViewModel, int> serviceU, ICrudApi<ClientesViewModel, string> clientes, ICrudApi<ProductosViewModel, string> productos, ICrudApi<CantonesViewModel, int> serviceC, ICrudApi<DistritosViewModel, int> serviceD, ICrudApi<BarriosViewModel, int> serviceB, ICrudApi<ListaPreciosViewModel, int> precio, ICrudApi<ExoneracionesViewModel, int> exo, ICrudApi<GruposClientesViewModel, int> grupo, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<OfertasViewModel, int> serviceO, ICrudApi<CuentasBancariasViewModel, int> serviceCB, ICrudApi<CondicionesPagosViewModel, int> serviceCP, ICrudApi<VendedoresViewModel, int> vendedor, ICrudApi<UsuariosViewModel, int> usuario, ICrudApi<BodegasViewModel, int> bodegas, ICrudApi<DocumentosCreditoViewModel, int> documentos, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<SeriesProductosViewModel, int> series) //CTOR 
        {
            this.service = service;
            this.serviceU = serviceU;
            this.clientes = clientes;
            this.productos = productos;
            this.serviceC = serviceC;
            this.serviceD = serviceD;
            this.serviceB = serviceB;
            this.precio = precio;
            this.exo = exo;
            this.grupo = grupo;
            this.tipoCambio = tipoCambio;
            this.serviceO = serviceO;
            this.serviceCB = serviceCB;
            this.serviceCP = serviceCP;
            this.vendedor = vendedor;
            this.usuario = usuario;
            this.bodegas = bodegas;
            this.documentos = documentos;
            this.sucursales = sucursales;
            this.series = series;
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "50").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                if (id != 0)
                {
                    var Oferta = await serviceO.ObtenerPorId(id);
                    Documento = new DocumentosViewModel();
                    Documento.Fecha = Oferta.Fecha;
                    Documento.idOferta = id;
                    Documento.CodSuc = Oferta.CodSuc;
                    Documento.idCliente = Oferta.idCliente;
                    Documento.idVendedor = Oferta.idVendedor;
                    Documento.idCondPago = Oferta.idCondPago;
                    Documento.idUsuarioCreador = Oferta.idUsuarioCreador;
                    Documento.Comentarios = Oferta.Comentarios;
                    Documento.TipoDocumento = Oferta.TipoDocumento;
                    Documento.Moneda = Oferta.Moneda;
                    Documento.Subtotal = Oferta.Subtotal;
                    Documento.TotalImpuestos = Oferta.TotalImpuestos;
                    Documento.TotalDescuento = Oferta.TotalDescuento;
                    Documento.TotalCompra = Oferta.TotalCompra;
                    Documento.PorDescto = Oferta.PorDescto;
                    Documento.Comentarios = Oferta.Comentarios +  " | Basado en la oferta # " + id;
                    var Tamaño = Oferta.Detalle.Length;
                    Documento.Detalle = new DetDocumentoViewModel[Tamaño];

                    var i = 0;
                    foreach (var item in Oferta.Detalle)
                    {
                        Documento.Detalle[i] = new DetDocumentoViewModel();
                        DetDocumentoViewModel det = new DetDocumentoViewModel();
                        det.idProducto = item.idProducto;
                        det.NumLinea = item.NumLinea;
                        det.Cantidad = item.Cantidad;
                        det.TotalImpuesto = item.TotalImpuesto;
                        det.PrecioUnitario = item.PrecioUnitario;
                        det.PorDescto = item.PorDescto;
                        det.Descuento = item.Descuento;
                        det.TotalLinea = item.TotalLinea;
                        det.Cabys = item.Cabys;
                        det.idExoneracion = item.idExoneracion;
                  
                        Documento.Detalle[i] = det;
                        i++;
                    }
                    var x = 0;
                    var Tamaño2 = Oferta.Lotes.Length;
                    Documento.Lotes = new LotesViewModel[Tamaño2];

                    foreach (var item2 in Oferta.Lotes)
                    {
                        Documento.Lotes[x] = new LotesViewModel();
                        LotesViewModel lot = new LotesViewModel();
                        lot.Serie = item2.Serie;
                        lot.ItemCode = item2.ItemCode;
                        lot.Cantidad = item2.Cantidad;
                        lot.Tipo = item2.Tipo;
                        lot.Manufactura = item2.Manufactura;
                        //lot.idDetalle = item.id;
                        //lot.idEncabezado = item2.idEncabezado;


                        Documento.Lotes[x] = lot;
                        x++;
                    }

                }
                else
                {
                    Documento = new DocumentosViewModel();
                }

                CP = await serviceCP.ObtenerLista("");



                ParametrosFiltros FiltroCB = new ParametrosFiltros();
                FiltroCB.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                var idUsuario = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());
                CB = await serviceCB.ObtenerLista(FiltroCB);
                DES = await usuario.ObtenerPorId(idUsuario);
                Descuento = DES.Descuento;

                Impuestos = await serviceU.ObtenerLista("");
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;
               
                Clientes = await clientes.ObtenerLista(filtro);
                Clientes = Clientes.Where(a => a.Activo == true).ToArray();
                filtro.CardCode = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                filtro.CardName = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                var Suc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();

                Productos = await productos.ObtenerLista(filtro);
                Cantones = await serviceC.ObtenerLista("");
                Distritos = await serviceD.ObtenerLista("");
                Barrios = await serviceB.ObtenerLista("");
                PrecioLista = await precio.ObtenerLista("");
                Exoneraciones = await exo.ObtenerLista("");
                Grupos = await grupo.ObtenerLista("");
                filtro.FechaInicial = DateTime.Now.Date;
                TP = await tipoCambio.ObtenerLista(filtro);
                Vendedores = await vendedor.ObtenerLista(filtro);
                Vendedores = Vendedores.Where(a => a.Activo == true).ToArray();
                Bodega = await bodegas.ObtenerLista("");
                Sucursal = await sucursales.ObtenerLista("");
                MiSucursal = Sucursal.Where(a => a.CodSuc.ToUpper().Contains(Suc)).FirstOrDefault();
                SeriesProductos = await series.ObtenerListaEspecial("");
                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }


        public async Task<IActionResult> OnPostAgregarCliente(ClientesViewModel recibidos)
        {
            string error = "";


            try
            {


                var resp = await clientes.Agregar(recibidos);

                var resp2 = new
                {
                    success = true,
                    Cliente = resp
                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());

                var resp2 = new
                {
                    success = false,
                    Cliente = be.Descripcion
                };
                return new JsonResult(resp2);
                //return new JsonResult(false);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Cliente = ex.Message
                };
                return new JsonResult(resp2);
            }
        }

        public async Task<IActionResult> OnPostAgregarDocumento(DocumentosViewModel recibidos)
        {
            string error = "";


            try
            {
                var Condiciones = await serviceCP.ObtenerLista("");
                recibidos.idCaja = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault().ToString());

                recibidos.CodSuc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                recibidos.idUsuarioCreador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());
                recibidos.BaseEntry = recibidos.idOferta;
                var Dias = Condiciones.Where(a => a.id == recibidos.idCondPago).FirstOrDefault() == null ? 0 : Condiciones.Where(a => a.id == recibidos.idCondPago).FirstOrDefault().Dias;
                recibidos.FechaVencimiento = recibidos.Fecha.AddDays(Dias);
                var resp = await service.Agregar(recibidos);

                if (recibidos.idOferta > 0)
                {
                    await serviceO.Eliminar(recibidos.idOferta);

                }

                var resp2 = new
                {
                    success = true,
                    Documento = resp
                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());

                var resp2 = new
                {
                    success = false,
                    Documento = be.Descripcion
                };
                return new JsonResult(resp2);
                //return new JsonResult(false);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Documento = ex.Message
                };
                return new JsonResult(resp2);
            }
        }
        public async Task<IActionResult> OnGetFacturas(int idCliente)
        {
            try
            {


                if (idCliente > 0)
                {



                    var objetos = await documentos.ObtenerFacturaC(idCliente);

                    var objeto = objetos.ToList();



                    return new JsonResult(objeto);
                }
                else
                {
                    var objeto = new DocumentosCreditoViewModel[0];



                    return new JsonResult(objeto);
                }

            }
            catch (ApiException ex)
            {



                return new JsonResult(ex.Content.ToString());
            }
            catch (Exception ex)
            {



                return new JsonResult(ex.Message.ToString());
            }
        }

    }
}
