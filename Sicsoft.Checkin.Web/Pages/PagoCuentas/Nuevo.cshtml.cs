using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.PagoCuentas
{
    public class NuevoModel : PageModel
    {
        private readonly ICrudApi<PagoCuentasViewModel, int> service; //API
        private readonly ICrudApi<ClientesViewModel, string> clientes;
        private readonly ICrudApi<CuentasBancariasViewModel, int> serviceCB;
        private readonly ICrudApi<TipoCambiosViewModel, int> tipoCambio;
        private readonly ICrudApi<ParametrosViewModel, int> param;


        [BindProperty]
        public PagoCuentasViewModel Cuenta { get; set; }

        [BindProperty]
        public ClientesViewModel[] ClientesLista { get; set; }

        [BindProperty]
        public CuentasBancariasViewModel[] CB { get; set; }

        [BindProperty]
        public TipoCambiosViewModel[] TP { get; set; }

        [BindProperty]
        public ParametrosViewModel[] Parametro { get; set; }

        public NuevoModel(ICrudApi<PagoCuentasViewModel, int> service, ICrudApi<ParametrosViewModel, int> param, ICrudApi<ClientesViewModel, string> clientes, ICrudApi<CuentasBancariasViewModel, int> serviceCB, ICrudApi<TipoCambiosViewModel, int> tipoCambio) //CTOR 
        {
            this.service = service;
            this.clientes = clientes;
            this.serviceCB = serviceCB;
            this.tipoCambio = tipoCambio;
            this.param = param;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "57").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;
                ClientesLista = await clientes.ObtenerLista(filtro);
                ClientesLista = ClientesLista.Where(a => a.Activo == true && !a.Nombre.ToLower().Contains("contado")).ToArray();
                ParametrosFiltros FiltroCB = new ParametrosFiltros();
                FiltroCB.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                CB = await serviceCB.ObtenerLista(FiltroCB);
                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.FechaInicial = DateTime.Now.Date;
                TP = await tipoCambio.ObtenerLista(filtro2);
                Parametro = await param.ObtenerLista("");

                if (Parametro.FirstOrDefault().Pais == "P" && TP.Length == 0)
                {
                    TP = new TipoCambiosViewModel[1];
                    var TipoCambiosViewModel = new TipoCambiosViewModel();
                    TipoCambiosViewModel.TipoCambio = 1;
                    TipoCambiosViewModel.Moneda = "USD";
                    TP[0] = TipoCambiosViewModel;
                }
     
                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }

        public async Task<IActionResult> OnPostAgregarPagoCuenta(PagoCuentasViewModel recibidos)
        {
            try
            {
                recibidos.CodSuc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                recibidos.idCaja = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault().ToString());
                recibidos.idUsuarioCreador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());
                var resp = await service.Agregar(recibidos);

                var resp2 = new
                {
                    success = true,
                    PagoCuenta = resp
                };
                return new JsonResult(resp2);
                
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());
                var resp2 = new
                {
                    success = false,
                    PagoCuenta = be.Descripcion
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
    }
}
