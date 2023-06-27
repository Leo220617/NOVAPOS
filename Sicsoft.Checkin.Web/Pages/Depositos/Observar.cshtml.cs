using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.Depositos
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<DepositosViewModel, int> service;
        private readonly ICrudApi<UsuariosViewModel, int> serviceU;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<CuentasSAPViewModel, int> cuentas;
        private readonly ICrudApi<CuentasBancariasViewModel, int> serviceCB;



        [BindProperty]
        public DepositosViewModel Listas { get; set; }

        [BindProperty]
        public UsuariosViewModel[] Users { get; set; }
        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }

        [BindProperty]
        public CuentasBancariasViewModel[] CB { get; set; }

        [BindProperty]
        public CuentasSAPViewModel Cuentas { get; set; }

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }
        public ObservarModel(ICrudApi<DepositosViewModel, int> service, ICrudApi<UsuariosViewModel, int> serviceU, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<CuentasSAPViewModel, int> cuentas, ICrudApi<CuentasBancariasViewModel, int> serviceCB)
        {
            this.service = service;
            this.sucursales = sucursales;
            this.serviceU = serviceU;
            this.cuentas = cuentas;
            this.serviceCB = serviceCB;

        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "54").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

             
              

                Listas = await service.ObtenerPorId(id);
                CB = await serviceCB.ObtenerLista("");
                Cuentas = await cuentas.ObtenerListaEspecial("");



                ParametrosFiltros filtro2 = new ParametrosFiltros();
              

                Sucursales = await sucursales.ObtenerLista("");
                Users = await serviceU.ObtenerLista("");

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
