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

        [BindProperty]
        public PagoCuentasViewModel Cuenta { get; set; }

        [BindProperty]
        public ClientesViewModel[] ClientesLista { get; set; }

        public NuevoModel(ICrudApi<PagoCuentasViewModel, int> service, ICrudApi<ClientesViewModel, string> clientes) //CTOR 
        {
            this.service = service;
            this.clientes = clientes;
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
                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }

        public async Task<IActionResult> OnPostAsync()
        {
            try
            {
                Cuenta.CodSuc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                Cuenta.idCaja = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault().ToString());
                Cuenta.idUsuarioCreador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());
                await service.Agregar(Cuenta);
                return RedirectToPage("./Index");
            }
            catch (ApiException ex)
            { 
                ModelState.AddModelError(string.Empty, ex.Content.ToString());

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
