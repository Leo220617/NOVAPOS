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
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<PagoCuentasViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;
        private readonly ICrudApi<ClientesViewModel, string> clientes;
        private readonly ICrudApi<RolesViewModel, int> roles;
        private readonly ICrudApi<UsuariosSucursalesViewModel, int> usuc;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<ParametrosViewModel, int> param;

        [BindProperty]
        public PagoCuentasViewModel[] Listas { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }
        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }



        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public ParametrosViewModel[] Parametros { get; set; }

        public IndexModel(ICrudApi<PagoCuentasViewModel, int> service, ICrudApi<ParametrosViewModel, int> param, ICrudApi<ClientesViewModel, string> clientes, ICrudApi<UsuariosViewModel, int> serviceU, ICrudApi<RolesViewModel, int> roles, ICrudApi<UsuariosSucursalesViewModel, int> usuc, ICrudApi<SucursalesViewModel, string> sucursales)
        {
            this.service = service;
            this.clientes = clientes;
            this.serviceU = serviceU;
            this.roles = roles;
            this.usuc = usuc;
            this.sucursales = sucursales;
            this.param = param;

        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "57").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                DateTime time = new DateTime();
                if (time == filtro.FechaInicial)
                {

                    filtro.CardCode = "CRC";
                    filtro.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                    filtro.FechaInicial = DateTime.Now;

                    filtro.FechaInicial = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime primerDia = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime ultimoDia = primerDia.AddMonths(1).AddDays(-1);

                    filtro.FechaFinal = ultimoDia;


                    filtro.Codigo2 = 0;
                    filtro.Codigo3 = 0;
                    filtro.Codigo4 = 0;
                    filtro.ItemCode = "0";
                    filtro.CardName = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();


                }

               
                Listas = await service.ObtenerLista(filtro);
                Sucursales = await sucursales.ObtenerLista(filtro);



                var Roles = await roles.ObtenerLista("");
                var RolCajero = Roles.Where(a => a.NombreRol.ToLower().Contains("cajero".ToLower())).FirstOrDefault();
                var UsuariosSucursales = await usuc.ObtenerLista(filtro);


                Users = await serviceU.ObtenerLista("");

                //Users = Users.Where(a => a.idRol == RolCajero.idRol).ToArray();
                Users = Users.Where(a => a.novapos == true).ToArray();



                foreach (var item in Users)
                {

                    if (UsuariosSucursales.Where(a => a.idUsuario == item.id).FirstOrDefault() == null)
                    {
                        Users = Users.Where(a => a.id != item.id).ToArray();
                    }
                }

                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.Externo = true;

                Clientes = await clientes.ObtenerLista(filtro2);
                Parametros = await param.ObtenerLista("");
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
                return new JsonResult(true);
            }
            catch (ApiException ex)
            {
                return new JsonResult(false);
            }
            catch (Exception ex)
            {
                return new JsonResult(false);

            }
        }

    }
}
