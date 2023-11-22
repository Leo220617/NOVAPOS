using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.PagoCuentas
{
    public class ObservarModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<PagoCuentasViewModel, int> service; //API
        private readonly ICrudApi<ClientesViewModel, string> clientes;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<CuentasBancariasViewModel, int> serviceCB;

        [BindProperty]
        public PagoCuentasViewModel Cuenta { get; set; }

        [BindProperty]
        public ClientesViewModel[] ClientesLista { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursal { get; set; }

        [BindProperty]
        public SucursalesViewModel MiSucursal { get; set; }

        [BindProperty]
        public string NombreCliente { get; set; }

        [BindProperty]
        public CuentasBancariasViewModel[] CB { get; set; }
        public ObservarModel(IConfiguration configuration, ICrudApi<PagoCuentasViewModel, int> service, ICrudApi<ClientesViewModel, string> clientes, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<CuentasBancariasViewModel, int> serviceCB) //CTOR 
        {
            this.service = service;
            this.clientes = clientes;
            this.sucursales = sucursales;
            this.configuration = configuration;
            this.serviceCB = serviceCB;
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "57").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Cuenta = await service.ObtenerPorId(id);
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;
                ClientesLista = await clientes.ObtenerLista(filtro);
                var Suc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                Sucursal = await sucursales.ObtenerLista("");
                MiSucursal = Sucursal.Where(a => a.CodSuc.ToUpper().Contains(Suc)).FirstOrDefault();
                NombreCliente = configuration["Cliente"].ToString();
                ParametrosFiltros FiltroCB = new ParametrosFiltros();
                FiltroCB.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                CB = await serviceCB.ObtenerLista(FiltroCB);
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
