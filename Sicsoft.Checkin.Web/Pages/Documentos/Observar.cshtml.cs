
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

        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public DocumentosViewModel Documento { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        [BindProperty]
        public ExoneracionesViewModel[] Exoneraciones { get; set; }

        public ObservarModel(ICrudApi<DocumentosViewModel, int> service, ICrudApi<ClientesViewModel, string> serviceE, ICrudApi<ProductosViewModel, string> serviceP, ICrudApi<ExoneracionesViewModel, int> exoneracion)
        {
            this.service = service;
            this.serviceE = serviceE;
            this.serviceP = serviceP;
            this.exoneracion = exoneracion;
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
                Documento = await service.ObtenerPorId(id);
                Clientes = await serviceE.ObtenerLista("");
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