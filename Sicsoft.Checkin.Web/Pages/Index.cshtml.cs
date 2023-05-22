using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Sicsoft.Checkin.Web.Pages
{
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly ICrudApi<CierreCajasViewModel, int> service;


        public IndexModel(ILogger<IndexModel> logger, ICrudApi<CierreCajasViewModel, int> service)
        {
            _logger = logger;
            this.service = service;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var DiaAnterior = DateTime.Now.AddDays(-1).Date;
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true; // para traer los activos
                filtro.Codigo2 = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault().ToString());
                filtro.FechaInicial = DiaAnterior;
                filtro.FechaFinal = DiaAnterior;
                filtro.Activo = true;
                var Cierre = await service.ObtenerLista(filtro);
                Cierre = Cierre.Where(a => a.FechaCaja == DiaAnterior).ToArray();
                if(Cierre.Count() > 0)
                {
                    string url = "/CierreCajas/Editar";
                    var objeto = new 
                    {
                        DiaAnterior = DiaAnterior
                    };
                    return RedirectToPage(url, objeto);
                }


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
