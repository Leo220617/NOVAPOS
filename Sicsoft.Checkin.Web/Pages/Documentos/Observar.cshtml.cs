
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
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using NOVAAPP.Models;


namespace NOVAAPP.Pages.Documentos
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<DocumentosViewModel, int> service;
        private readonly ICrudApi<ClientesViewModel, string> serviceE;
        private readonly ICrudApi<ProductosViewModel, string> serviceP;
        private readonly ICrudApi<ExoneracionesViewModel, int> exoneracion;
        private readonly ICrudApi<CondicionesPagosViewModel, int> condiconesPago;
        private readonly ICrudApi<VendedoresViewModel, int> vendedor;
        private readonly ICrudApi<TipoCambiosViewModel, int> tipoCambio;



        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public DocumentosViewModel Documento { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        [BindProperty]
        public ExoneracionesViewModel[] Exoneraciones { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel CondicionesPago { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel[] CondicionesPagos { get; set; }
        [BindProperty]
        public TipoCambiosViewModel[] TP { get; set; }

        [BindProperty]
        public VendedoresViewModel Vendedor { get; set; }

        public ObservarModel(ICrudApi<DocumentosViewModel, int> service, ICrudApi<ClientesViewModel, string> serviceE, ICrudApi<ProductosViewModel, string> serviceP, ICrudApi<ExoneracionesViewModel, int> exoneracion, ICrudApi<CondicionesPagosViewModel, int> condiconesPago, ICrudApi<VendedoresViewModel, int> vendedor,ICrudApi<TipoCambiosViewModel, int> tipoCambio)
        {
            this.service = service;
            this.serviceE = serviceE;
            this.serviceP = serviceP;
            this.exoneracion = exoneracion;
            this.condiconesPago = condiconesPago;
            this.vendedor = vendedor;
            this.tipoCambio = tipoCambio;
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "32").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                var CondPago = await condiconesPago.ObtenerLista("");
                var Vendedores = await vendedor.ObtenerLista("");

                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true; 

                Documento = await service.ObtenerPorId(id);
                CondicionesPago = CondPago.Where(a => a.id == Documento.idCondPago).FirstOrDefault();
                Vendedor = Vendedores.Where(a => a.id == Documento.idVendedor).FirstOrDefault();

                Clientes = await serviceE.ObtenerLista(filtro);
                CondicionesPagos = CondPago;

                filtro.FechaInicial = DateTime.Now.Date;
                TP = await tipoCambio.ObtenerLista(filtro);

                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.CardCode = Documento.CodSuc;
         
                Productos = await serviceP.ObtenerLista(filtro2);
                Exoneraciones = await exoneracion.ObtenerLista("");

                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }
    }
}
