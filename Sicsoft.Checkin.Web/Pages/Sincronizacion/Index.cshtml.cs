using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using NOVAPOS.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAPOS.Pages.Sincronizacion
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<ProductosViewModel, string> service;
        private readonly ICrudApi<ClientesViewModel, string> clientes;

        [BindProperty]
        public ClientesViewModel[] Cliente { get; set; }


        [BindProperty]
        public ProductosViewModel[] Objeto { get; set; }
        public IndexModel(ICrudApi<ProductosViewModel, string> service, ICrudApi<ClientesViewModel, string> clientes)
        {
            this.service = service;
            this.clientes = clientes;

        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "76").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
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
        public async Task<IActionResult> OnGetInsertarSAPByCardCode(string id)
        {
            try
            {

                await clientes.InsertarSAPByCardCode(id);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
        }
        public async Task<IActionResult> OnGetInsertarSAPByProduct(string id)
        {
            try
            {

                await service.InsertarSAPByCardCode(id);
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
        }
    }
}
