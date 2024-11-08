using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using NOVAPOS.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.IO.Compression;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace NOVAAPP.Pages.Proformas
{
    public class EditarModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<OfertasViewModel, int> service; //API
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
        private readonly ICrudApi<CondicionesPagosViewModel, int> serviceCP; //API
        private readonly ICrudApi<VendedoresViewModel, int> vendedor;
        private readonly ICrudApi<UsuariosViewModel, int> usuario;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<DocumentosCreditoViewModel, int> documentos;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<SeriesProductosViewModel, int> series;
        private readonly ICrudApi<ParametrosViewModel, int> parametro;
        private readonly ICrudApi<PromocionesViewModel, int> promociones;
        private readonly ICrudApi<EncMargenesViewModel, int> margenes;
        private readonly ICrudApi<DetMargenesViewModel, int> detmargenes;
        private readonly ICrudApi<AprobacionesCreditosViewModel, int> aprobaciones;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<ParametrosViewModel, int> param;
     

        [BindProperty]
        public OfertasViewModel Oferta { get; set; }

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
        public CondicionesPagosViewModel[] CP { get; set; }

        [BindProperty]
        public UsuariosViewModel DES { get; set; }

        [BindProperty]
        public decimal Descuento { get; set; }

        [BindProperty]
        public VendedoresViewModel[] Vendedores { get; set; }

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

        [BindProperty]
        public ParametrosViewModel[] Parametro { get; set; }

        [BindProperty]
        public PromocionesViewModel[] DetPromociones { get; set; }

        [BindProperty]
        public EncMargenesViewModel[] Margenes { get; set; }

        [BindProperty]
        public DetMargenesViewModel[] DetMargenes { get; set; }


        [BindProperty]
        public AprobacionesCreditosViewModel[] Aprobaciones { get; set; }


        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }

        [BindProperty]
        public ParametrosViewModel[] Parametros { get; set; }

        [BindProperty]
        public string Empresa { get; set; }
        public EditarModel(IConfiguration configuration, ICrudApi<ParametrosViewModel, int> parametro,  ICrudApi<OfertasViewModel, int> service, ICrudApi<ImpuestosViewModel, int> serviceU, ICrudApi<ClientesViewModel, string> clientes, ICrudApi<ProductosViewModel, string> productos, ICrudApi<CantonesViewModel, int> serviceC, ICrudApi<DistritosViewModel, int> serviceD, ICrudApi<BarriosViewModel, int> serviceB, ICrudApi<ListaPreciosViewModel, int> precio, ICrudApi<ExoneracionesViewModel, int> exo, ICrudApi<GruposClientesViewModel, int> grupo, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<CondicionesPagosViewModel, int> serviceCP, ICrudApi<VendedoresViewModel, int> vendedor, ICrudApi<UsuariosViewModel, int> usuario, ICrudApi<BodegasViewModel, int> bodegas, ICrudApi<DocumentosCreditoViewModel, int> documentos, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<SeriesProductosViewModel, int> series, ICrudApi<PromocionesViewModel, int> promociones, ICrudApi<EncMargenesViewModel, int> margenes, ICrudApi<DetMargenesViewModel, int> detmargenes, ICrudApi<AprobacionesCreditosViewModel, int> aprobaciones, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<ParametrosViewModel, int> param) //CTOR 
        {
            this.configuration = configuration;
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
            this.serviceCP = serviceCP;
            this.vendedor = vendedor;
            this.usuario = usuario;
            this.bodegas = bodegas;
            this.documentos = documentos;
            this.sucursales = sucursales;
            this.series = series;
            this.parametro = parametro;
            this.promociones = promociones;
            this.margenes = margenes;
            this.detmargenes = detmargenes;
            this.aprobaciones = aprobaciones;
            this.categorias = categorias;
            this.param = param;
        
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                Empresa = configuration["CodCliente"].ToString();
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "45").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                Oferta = await service.ObtenerPorId(id);
                Parametro = await parametro.ObtenerLista("");
                CP = await serviceCP.ObtenerLista("");
                var idUsuario = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());
                DES = await usuario.ObtenerPorId(idUsuario);
                Impuestos = await serviceU.ObtenerLista("");
                Descuento = DES.Descuento;
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;
                Clientes = await clientes.ObtenerLista(filtro);
                Clientes = Clientes.Where(a => a.Activo == true).ToArray();
                filtro.CardCode = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                filtro.CardName = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                Productos = await productos.ObtenerLista(filtro);
            
                var Suc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
              

                Cantones = await serviceC.ObtenerLista("");
                Distritos = await serviceD.ObtenerLista("");
                Barrios = await serviceB.ObtenerLista("");
                PrecioLista = await precio.ObtenerLista("");
                var Exonera = await exo.ObtenerLista("");
                Exoneraciones = Exonera.Where(a => a.Activo = true).ToArray();
                Grupos = await grupo.ObtenerLista("");
                filtro.FechaInicial = DateTime.Now.Date;


                TP = await tipoCambio.ObtenerLista(filtro);


                if (Parametro.FirstOrDefault().Pais == "P" && TP.Length == 0)
                {
                    TP = new TipoCambiosViewModel[1];
                    var TipoCambiosViewModel = new TipoCambiosViewModel();
                    TipoCambiosViewModel.TipoCambio = 1;
                    TipoCambiosViewModel.Moneda = "USD";
                    TP[0] = TipoCambiosViewModel;
                }
                Vendedores = await vendedor.ObtenerLista(filtro);
                Vendedores = Vendedores.Where(a => a.Activo == true).ToArray();
                Bodega = await bodegas.ObtenerLista("");
                Sucursal = await sucursales.ObtenerLista("");
                MiSucursal = Sucursal.Where(a => a.CodSuc.ToUpper().Contains(Suc)).FirstOrDefault();
                ParametrosFiltros filtroSeries = new ParametrosFiltros();
                filtroSeries.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                SeriesProductos = await series.ObtenerListaEspecial(filtroSeries);


                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.Activo = true;
                DetPromociones = await promociones.ObtenerLista(filtro2);

                ParametrosFiltros filtro3 = new ParametrosFiltros();
                filtro3.Codigo1 = MiSucursal.idListaPrecios;
                Margenes = await margenes.ObtenerLista(filtro3);
                DetMargenes = await detmargenes.ObtenerLista(filtro3);
                ParametrosFiltros filtro4 = new ParametrosFiltros();
                filtro4.Activo = true;
                filtro4.FechaInicial = DateTime.Now.Date;
                filtro4.FechaFinal = DateTime.Now.Date.AddDays(1).AddSeconds(-1);
                filtro4.Texto = "A";
                Aprobaciones = await aprobaciones.ObtenerLista(filtro4);
                Categorias = await categorias.ObtenerLista("");
                Parametros = await param.ObtenerLista("");
           
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

        public async Task<IActionResult> OnPostAgregarAprobacion(AprobacionesCreditosViewModel recibidos)
        {
            string error = "";


            try
            {

                recibidos.idUsuarioCreador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());
                var resp = await aprobaciones.Agregar(recibidos);

                var resp2 = new
                {
                    success = true,
                    Aprobaciones = resp
                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());

                var resp2 = new
                {
                    success = false,
                    Aprobaciones = be.Descripcion
                };
                return new JsonResult(resp2);
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

        public async Task<IActionResult> OnPostAgregarOferta()
        {
            string error = "";

            OfertasViewModel recibidos = new OfertasViewModel();
            try
            {
                var ms = new MemoryStream();
                await Request.Body.CopyToAsync(ms);

                byte[] compressedData = ms.ToArray();

                // Descomprimir los datos utilizando GZip
                using (var compressedStream = new MemoryStream(compressedData))
                using (var decompressedStream = new MemoryStream())
                {
                    using (var decompressionStream = new GZipStream(compressedStream, CompressionMode.Decompress))
                    {
                        decompressionStream.CopyTo(decompressedStream);
                    }

                    // Convertir los datos descomprimidos a una cadena JSON
                    var jsonString = System.Text.Encoding.UTF8.GetString(decompressedStream.ToArray());

                    // Procesar la cadena JSON como desees
                    // Por ejemplo, puedes deserializarla a un objeto C# utilizando Newtonsoft.Json
                    recibidos = Newtonsoft.Json.JsonConvert.DeserializeObject<OfertasViewModel>(jsonString);
                }



                recibidos.CodSuc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();

                recibidos.idUsuarioCreador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());
                await service.Editar(recibidos);

                var resp2 = new
                {
                    success = true,
                    Oferta = ""
                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());
                var resp2 = new
                {
                    success = false,
                    Oferta = be.Descripcion
                };
                return new JsonResult(resp2);

            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Oferta = ex.Message
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
