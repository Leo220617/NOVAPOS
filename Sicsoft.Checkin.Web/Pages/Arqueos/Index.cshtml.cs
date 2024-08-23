using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using NOVAPOS.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using Sicsoft.CostaRica.Checkin.Web.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAPOS.Pages.Arqueos
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<ArqueosViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<RolesViewModel, int> roles;
        private readonly ICrudApi<UsuariosSucursalesViewModel, int> usuc;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
   



        [BindProperty]
        public ArqueosViewModel[] Listas { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }



        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }


        [BindProperty]
        public SucursalesViewModel[] Sucursal { get; set; }

        [BindProperty]
        public SucursalesViewModel MiSucursal { get; set; }



        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        public IndexModel(ICrudApi<ArqueosViewModel, int> service, ICrudApi<UsuariosViewModel, int> serviceU, ICrudApi<RolesViewModel, int> roles, ICrudApi<UsuariosSucursalesViewModel, int> usuc, ICrudApi<CategoriasViewModel, int> categorias,  ICrudApi<BodegasViewModel, int> bodegas)
        {
            this.service = service;
            this.serviceU = serviceU;
            this.roles = roles;
            this.usuc = usuc;
            this.categorias = categorias;
            this.bodegas = bodegas;

        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "71").FirstOrDefault()))
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


                    filtro.Codigo1 = 0;
                    filtro.Codigo2 = 0;
                    filtro.Codigo3 = 0;
                    filtro.ItemCode = "0";
                    filtro.pendientes = true;
                    filtro.CardName = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();


                }


                Listas = await service.ObtenerLista(filtro);
                Categorias = await categorias.ObtenerLista("");

                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                Bodegas = await bodegas.ObtenerLista(filtro2);



                var Roles = await roles.ObtenerLista("");
                var RolCajero = Roles.Where(a => a.NombreRol.ToLower().Contains("cajero".ToLower())).FirstOrDefault();
                var UsuariosSucursales = await usuc.ObtenerLista(filtro);


                Users = await serviceU.ObtenerLista("");

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

        public async Task<IActionResult> OnGetEliminar(int id)
        {
            try
            {

                await service.Eliminar(id);
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