using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using NOVAAPP.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Refit;
using Sicsoft.Checkin.Web.Servicios;

using NOVAAPP.Models;
using InversionGloblalWeb.Models;

namespace NOVAAPP.Pages.Productos
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<ProductosViewModel, string> service;
        private readonly ICrudApi<BodegasViewModel, int> serviceBodegas;
        private readonly ICrudApi<ListaPreciosViewModel, int> serviceListas;
        private readonly ICrudApi<ImpuestosViewModel, int> serviceImpuestos;


        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public ProductosViewModel[] Objeto { get; set; }

        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }

        [BindProperty]
        public ListaPreciosViewModel[] Listas { get; set; }

        [BindProperty]
        public ImpuestosViewModel[] Impuestos { get; set; }

        public IndexModel(ICrudApi<ProductosViewModel, string> service, ICrudApi<BodegasViewModel, int> serviceBodegas, ICrudApi<ListaPreciosViewModel, int> serviceListas, ICrudApi<ImpuestosViewModel, int> serviceImpuestos)
        {
            this.service = service;
            this.serviceBodegas = serviceBodegas;
            this.serviceListas = serviceListas;
            this.serviceImpuestos = serviceImpuestos;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "51").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

                Bodegas = await serviceBodegas.ObtenerLista("");
                Listas = await serviceListas.ObtenerLista("");
                Impuestos = await serviceImpuestos.ObtenerLista("");

                if (filtro.Codigo1 == 0 && filtro.Codigo2 == 0)
                {
                    filtro.Codigo1 = Bodegas.FirstOrDefault() == null ? 0 : Bodegas.FirstOrDefault().id;
                    filtro.Codigo2 = Listas.FirstOrDefault() == null ? 0 : Listas.FirstOrDefault().id;
                }

                Objeto = await service.ObtenerLista(filtro);


                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }
       
    }
}
