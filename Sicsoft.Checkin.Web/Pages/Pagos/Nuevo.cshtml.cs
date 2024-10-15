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


namespace NOVAAPP.Pages.Pagos
{
    public class NuevoModel : PageModel
    {
        private readonly ICrudApi<PagosViewModel, int> service; //API

        private readonly ICrudApi<ClientesViewModel, string> clientes;
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<DocumentosCreditoViewModel, int> documentos;


        private readonly ICrudApi<TipoCambiosViewModel, int> tipoCambio;
        private readonly ICrudApi<CondicionesPagosViewModel, int> serviceCP; //API

        private readonly ICrudApi<VendedoresViewModel, int> vendedor;
        private readonly ICrudApi<CuentasBancariasViewModel, int> serviceCB;
        private readonly ICrudApi<ParametrosViewModel, int> param;





        [BindProperty]
        public PagosViewModel Pago { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }
        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        [BindProperty]
        public DocumentosCreditoViewModel[] DocumentosC { get; set; }


        [BindProperty]
        public DocumentosCreditoViewModel DocumentosC2 { get; set; }


        [BindProperty]
        public TipoCambiosViewModel[] TP { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel[] CP { get; set; }



        [BindProperty]
        public int idVendedor { get; set; }



        [BindProperty]
        public VendedoresViewModel[] Vendedores { get; set; }

        [BindProperty]
        public CuentasBancariasViewModel[] CB { get; set; }

        [BindProperty]
        public ParametrosViewModel[] Parametro { get; set; }


        public NuevoModel(ICrudApi<PagosViewModel, int> service, ICrudApi<ParametrosViewModel, int> param, ICrudApi<ClientesViewModel, string> clientes, ICrudApi<ProductosViewModel, string> productos, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<CondicionesPagosViewModel, int> serviceCP, ICrudApi<VendedoresViewModel, int> vendedor, ICrudApi<DocumentosCreditoViewModel, int> documentos, ICrudApi<CuentasBancariasViewModel, int> serviceCB) //CTOR 
        {
            this.service = service;
            this.clientes = clientes;
            this.productos = productos;
            this.sucursales = sucursales;
            this.documentos = documentos;
            this.tipoCambio = tipoCambio;
            this.serviceCP = serviceCP;
            this.vendedor = vendedor;
            this.serviceCB = serviceCB;
            this.param = param;

        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "52").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }



                CP = await serviceCP.ObtenerLista("");
                var idUsuario = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());



                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;
                filtro.CardName = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                Clientes = await clientes.ObtenerLista(filtro);
                Clientes = Clientes.Where(a => a.Activo == true).ToArray();

                Productos = await productos.ObtenerLista("");
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
                Vendedores = await vendedor.ObtenerLista("");
                ParametrosFiltros FiltroCB = new ParametrosFiltros();
                FiltroCB.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                CB = await serviceCB.ObtenerLista(FiltroCB);
                Parametro = await param.ObtenerLista("");
                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }

        public async Task<IActionResult> OnGetFacturas(int idCliente)
        {
            try
            {


                if (idCliente > 0)
                {
                    ParametrosFiltros filtros = new ParametrosFiltros();
                    filtros.Codigo1 = idCliente;

                    var objetos = await documentos.ObtenerLista(filtros);

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


        public async Task<IActionResult> OnPostAgregarPago(PagosViewModel recibidos)
        {
            string error = "";


            try
            {
                recibidos.CodSuc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                recibidos.TotalPagado = recibidos.Detalle.Sum(a => a.Total);
                recibidos.TotalCapital = recibidos.Detalle.Sum(a => a.Capital);
                recibidos.TotalInteres = recibidos.Detalle.Sum(a => a.Interes);
                recibidos.idCaja = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault().ToString());
                recibidos.idUsuarioCreador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());
                var resp = await service.Agregar(recibidos);
                //if (recibidos.TotalPagado > 0)
                //{
                //    await service.Eliminar(recibidos.TotalPagado);

                //}
                var resp2 = new
                {
                    success = true,
                    Pago = resp
                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                var resp2 = new
                {
                    success = false,
                    Pago = ex.Content.ToString()
                };
                return new JsonResult(resp2);
            }
            catch (Exception ex)
            {


                var resp2 = new
                {
                    success = false,
                    Pago = ex.Message
                };
                return new JsonResult(resp2);
            }
        }
        public async Task<IActionResult> OnGetBuscarFM(int idB)
        {
            try
            {
                var FM = await documentos.ObtenerPorId(idB);

                return new JsonResult(FM);
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());


                return new JsonResult(error);
            }
        }



    }
}


