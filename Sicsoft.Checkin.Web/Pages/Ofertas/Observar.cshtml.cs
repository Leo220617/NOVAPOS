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


namespace NOVAAPP.Pages.Ofertas
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<OfertasViewModel, int> service;
        private readonly ICrudApi<ClientesViewModel, string> serviceE;
        private readonly ICrudApi<ProductosViewModel, string> serviceP;
        private readonly ICrudApi<ExoneracionesViewModel, int> exoneracion;
        private readonly ICrudApi<CondicionesPagosViewModel, int> condiconesPago;
        private readonly ICrudApi<VendedoresViewModel, int> vendedor;

        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public OfertasViewModel Oferta { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        [BindProperty]
        public ExoneracionesViewModel[] Exoneraciones { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel CondicionesPago { get; set; }

        [BindProperty]
        public VendedoresViewModel Vendedor { get; set; }

        public ObservarModel(ICrudApi<OfertasViewModel, int> service, ICrudApi<ClientesViewModel, string> serviceE, ICrudApi<ProductosViewModel, string> serviceP, ICrudApi<ExoneracionesViewModel, int> exoneracion, ICrudApi<CondicionesPagosViewModel, int> condiconesPago, ICrudApi<VendedoresViewModel, int> vendedor)
        {
            this.service = service;
            this.serviceE = serviceE;
            this.serviceP = serviceP;
            this.exoneracion = exoneracion;
            this.condiconesPago = condiconesPago;
            this.vendedor = vendedor;
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "21").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                var CondPago = await condiconesPago.ObtenerLista("");
                Oferta = await service.ObtenerPorId(id);
                var Vendedores = await vendedor.ObtenerLista("");
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;
                CondicionesPago = CondPago.Where(a => a.id == Oferta.idCondPago).FirstOrDefault();
                Vendedor = Vendedores.Where(a => a.id == Oferta.idVendedor).FirstOrDefault();
                Clientes = await serviceE.ObtenerLista(filtro);
                Productos = await serviceP.ObtenerLista("");
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
