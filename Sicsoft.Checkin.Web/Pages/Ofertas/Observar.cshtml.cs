
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

        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public OfertasViewModel Oferta { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        public ObservarModel(ICrudApi<OfertasViewModel, int> service, ICrudApi<ClientesViewModel, string> serviceE, ICrudApi<ProductosViewModel, string> serviceP)
        {
            this.service = service;
            this.serviceE = serviceE;
            this.serviceP = serviceP;
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
                Oferta = await service.ObtenerPorId(id);
                Clientes = await serviceE.ObtenerLista("");
                Productos = await serviceP.ObtenerLista("");

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