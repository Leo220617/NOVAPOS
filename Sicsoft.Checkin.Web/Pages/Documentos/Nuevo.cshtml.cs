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

        public NuevoModel(ICrudApi<DocumentosViewModel, int> service, ICrudApi<ImpuestosViewModel, int> serviceU, ICrudApi<ClientesViewModel, string> clientes, ICrudApi<ProductosViewModel, string> productos, ICrudApi<CantonesViewModel, int> serviceC, ICrudApi<DistritosViewModel, int> serviceD, ICrudApi<BarriosViewModel, int> serviceB, ICrudApi<ListaPreciosViewModel, int> precio, ICrudApi<ExoneracionesViewModel, int> exo, ICrudApi<GruposClientesViewModel, int> grupo, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<OfertasViewModel, int> serviceO, ICrudApi<CuentasBancariasViewModel, int> serviceCB, ICrudApi<CondicionesPagosViewModel, int> serviceCP) //CTOR 
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
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "33").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                if (id != 0)
                {
                    var Oferta = await serviceO.ObtenerPorId(id);
                    Documento = new DocumentosViewModel();
                    Documento.idOferta = id;
                    Documento.CodSuc = Oferta.CodSuc;
                    Documento.idCliente = Oferta.idCliente;
                    Documento.idUsuarioCreador = Oferta.idUsuarioCreador;
                    Documento.Comentarios = Oferta.Comentarios;
                    Documento.Moneda = Oferta.Moneda;
                    Documento.Subtotal = Oferta.Subtotal;
                    Documento.TotalImpuestos = Oferta.TotalImpuestos;
                    Documento.TotalDescuento = Oferta.TotalDescuento;
                    Documento.TotalCompra = Oferta.TotalCompra;
                    Documento.PorDescto = Oferta.PorDescto;
                    Documento.Comentarios = "Basado en la oferta # " + id;
                    var Tama�o = Oferta.Detalle.Length;
                    Documento.Detalle = new DetDocumentoViewModel[Tama�o];

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

                }

                CP = await serviceCP.ObtenerLista("");



                ParametrosFiltros FiltroCB = new ParametrosFiltros();
                FiltroCB.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                CB = await serviceCB.ObtenerLista(FiltroCB);

                Impuestos = await serviceU.ObtenerLista("");
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;
                Clientes = await clientes.ObtenerLista(filtro);
                filtro.CardCode = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();

                Productos = await productos.ObtenerLista(filtro);
                Cantones = await serviceC.ObtenerLista("");
                Distritos = await serviceD.ObtenerLista("");
                Barrios = await serviceB.ObtenerLista("");
                PrecioLista = await precio.ObtenerLista("");
                Exoneraciones = await exo.ObtenerLista("");
                Grupos = await grupo.ObtenerLista("");
                filtro.FechaInicial = DateTime.Now.Date;
                TP = await tipoCambio.ObtenerLista(filtro);
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
                Errores errores = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, errores.Message);
                return new JsonResult(error);
                //return new JsonResult(false);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Cliente = ""
                };
                return new JsonResult(resp2);
            }
        }

        public async Task<IActionResult> OnPostAgregarDocumento(DocumentosViewModel recibidos)
        {
            string error = "";


            try
            {
                recibidos.idCaja = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault().ToString());

                recibidos.CodSuc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                recibidos.idUsuarioCreador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());
                recibidos.BaseEntry = recibidos.idOferta;
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
                Errores errores = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, errores.Message);
                return new JsonResult(error);
                //return new JsonResult(false);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Documento = ""
                };
                return new JsonResult(resp2);
            }
        }


    }
}
