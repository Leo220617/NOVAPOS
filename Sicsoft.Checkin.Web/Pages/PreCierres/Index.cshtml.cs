using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System;

namespace NOVAAPP.Pages.PreCierres
{
    public class IndexModel : PageModel
    {

        private readonly ICrudApi<PreCierresViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> users;
        private readonly ICrudApi<CajasViewModel, int> cajas;
        private readonly ICrudApi<RolesViewModel, int> roles;
        private readonly ICrudApi<ParametrosViewModel, int> param;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public PreCierresViewModel[] Cierre { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }

        [BindProperty]
        public CajasViewModel[] Cajas { get; set; }

        [BindProperty]
        public ParametrosViewModel[] Parametros { get; set; }


        public IndexModel(ICrudApi<PreCierresViewModel,  int> service, ICrudApi<ParametrosViewModel, int> param, ICrudApi<UsuariosViewModel, int> users, ICrudApi<CajasViewModel, int> cajas, ICrudApi<RolesViewModel, int> roles)
        {
            this.service = service;
            this.users = users;
            this.cajas = cajas;
            this.roles = roles;
            this.param = param;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "58").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                DateTime time = new DateTime();
                if (time == filtro.FechaInicial)
                {


                    filtro.FechaInicial = DateTime.Now;

                    filtro.FechaInicial = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime primerDia = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime ultimoDia = primerDia.AddMonths(1).AddDays(-1);

                    filtro.FechaFinal = ultimoDia;

                    filtro.FechaInicial = DateTime.Now.Date;
                    filtro.FechaFinal = filtro.FechaInicial.AddDays(0);
                   

                }

                filtro.Codigo2 = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault().ToString());
                filtro.Codigo3 = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());

                filtro.Externo = true;
                filtro.Activo = false;
              
                Cierre = await service.ObtenerLista(filtro);
                Cierre = Cierre.Where(a => a.TotalVendidoColones > 0 || a.TotalAperturaColones > 0).ToArray();
                Users = await users.ObtenerLista("");
                Cajas = await cajas.ObtenerLista("");
                var RolesC = await roles.ObtenerLista("");
                //var RolCajero = RolesC.Where(a => a.NombreRol.ToLower().Contains("cajero".ToLower())).FirstOrDefault();

                // Users = Users.Where(a => a.idRol == RolCajero.idRol).ToArray();

                Users = Users.Where(a => a.novapos == true).ToArray();
                Parametros = await param.ObtenerLista("");

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
