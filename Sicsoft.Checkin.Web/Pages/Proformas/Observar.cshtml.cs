
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


namespace NOVAAPP.Pages.Proformas
{
    public class ObservarModel : PageModel
    {

        private readonly IConfiguration configuration;
        private readonly ICrudApi<OfertasViewModel, int> service;
        private readonly ICrudApi<ClientesViewModel, string> serviceE;
        private readonly ICrudApi<ProductosViewModel, string> serviceP;
        private readonly ICrudApi<ExoneracionesViewModel, int> exoneracion;
        private readonly ICrudApi<CondicionesPagosViewModel, int> condiconesPago;
        private readonly ICrudApi<VendedoresViewModel, int> vendedor;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<ParametrosViewModel, int> parametro;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;

        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public OfertasViewModel Oferta { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        [BindProperty]
        public ExoneracionesViewModel[] Exoneraciones { get; set; }


        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel CondicionesPago { get; set; }

        [BindProperty]
        public VendedoresViewModel Vendedor { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursal { get; set; }

        [BindProperty]
        public SucursalesViewModel MiSucursal { get; set; }
        [BindProperty]
        public string NombreCliente { get; set; }

        [BindProperty]
        public ParametrosViewModel[] Parametro { get; set; }

        [BindProperty]
        public string Empresa { get; set; }
        public ObservarModel(ICrudApi<ParametrosViewModel, int> parametro, IConfiguration configuration, ICrudApi<OfertasViewModel, int> service, ICrudApi<ClientesViewModel, string> serviceE, ICrudApi<ProductosViewModel, string> serviceP, ICrudApi<ExoneracionesViewModel, int> exoneracion, ICrudApi<CondicionesPagosViewModel, int> condiconesPago, ICrudApi<VendedoresViewModel, int> vendedor, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<BodegasViewModel, int> bodegas)
        {
            this.configuration = configuration;
            this.service = service;
            this.serviceE = serviceE;
            this.serviceP = serviceP;
            this.exoneracion = exoneracion;
            this.condiconesPago = condiconesPago;
            this.vendedor = vendedor;
            this.sucursales = sucursales;
            this.configuration = configuration;
            this.parametro = parametro;
            this.bodegas = bodegas;
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                Empresa = configuration["CodCliente"].ToString();
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "45").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                var CondPago = await condiconesPago.ObtenerLista("");
                var Vendedores = await vendedor.ObtenerLista("");
                Bodegas = await bodegas.ObtenerLista("");
                Oferta = await service.ObtenerPorId(id);
                Parametro = await parametro.ObtenerLista("");
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;
                CondicionesPago = CondPago.Where(a => a.id == Oferta.idCondPago).FirstOrDefault();
                Vendedor = Vendedores.Where(a => a.id == Oferta.idVendedor).FirstOrDefault();
                Clientes = await serviceE.ObtenerLista(filtro);
                Productos = await serviceP.ObtenerLista("");
                Exoneraciones = await exoneracion.ObtenerLista("");
                var Suc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                Sucursal = await sucursales.ObtenerLista("");
                MiSucursal = Sucursal.Where(a => a.CodSuc.ToUpper().Contains(Suc)).FirstOrDefault();
               
                NombreCliente = configuration["Cliente"].ToString();
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
