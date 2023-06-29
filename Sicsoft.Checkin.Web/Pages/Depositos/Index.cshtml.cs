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

namespace NOVAAPP.Pages.Depositos
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<DepositosViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<UsuariosSucursalesViewModel, int> usuc;
        private readonly ICrudApi<RolesViewModel, int> roles;


        [BindProperty]
        public DepositosViewModel[] Listas { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }
        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }


        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

    

        public IndexModel(ICrudApi<DepositosViewModel, int> service, ICrudApi<UsuariosViewModel, int> serviceU, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<RolesViewModel, int> roles, ICrudApi<UsuariosSucursalesViewModel, int> usuc)
        {
            this.service = service;
            this.sucursales = sucursales;
            this.serviceU = serviceU;
            this.roles = roles;
            this.usuc = usuc;
        

        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "54").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                DateTime time = new DateTime();
                filtro.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                if (time == filtro.FechaInicial)
                {


                    filtro.FechaInicial = DateTime.Now;

                    filtro.FechaInicial = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime primerDia = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime ultimoDia = primerDia.AddMonths(1).AddDays(-1);

                    filtro.FechaFinal = ultimoDia;
                    filtro.Codigo2 = 0;



                }

               
                filtro.Codigo3 = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault());


                filtro.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();



                Listas = await service.ObtenerLista(filtro);
              



                var Roles = await roles.ObtenerLista("");
                var RolCajero = Roles.Where(a => a.NombreRol.ToLower().Contains("cajero".ToLower())).FirstOrDefault();
                var UsuariosSucursales = await usuc.ObtenerLista(filtro);


                Users = await serviceU.ObtenerLista("");

                Sucursales = await sucursales.ObtenerLista(filtro);
                Users = Users.Where(a => a.novapos == true).ToArray();



                foreach (var item in Users)
                {

                    if (UsuariosSucursales.Where(a => a.idUsuario == item.id).FirstOrDefault() == null)
                    {
                        Users = Users.Where(a => a.id != item.id).ToArray();
                    }
                }

          
           
              

                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, ex.Message);

                return Page();
            }
        }
        public async Task<IActionResult> OnGetSincronizarSAP(int id)
        {
            try
            {

                await service.SincronizarSAP(id);
                var respuesta = new
                {
                    success = true,
                    motivo = ""
                };
                return new JsonResult(respuesta);
            }
            catch (ApiException ex)
            {
                var respuesta = new
                {
                    success = false,
                    motivo = ex.Content.ToString()
                };
                return new JsonResult(respuesta);
            }
            catch (Exception ex)
            {
                var respuesta = new
                {
                    success = false,
                    motivo = ex.Message
                };
                return new JsonResult(respuesta);

            }
        }

    }
}
