using Castle.Core.Configuration;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using System.Linq;
using NOVAPOS.Models;

namespace NOVAPOS.Pages.BitacoraMargenes
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration configuration;
        private readonly ICrudApi<BitacoraMargenesViewModel, int> service;
        private readonly ICrudApi<ListaPreciosViewModel, int> listas;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;

        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        [BindProperty]
        public BitacoraMargenesViewModel[] Objeto { get; set; }


        [BindProperty]
        public ListaPreciosViewModel[] ListaPrecio { get; set; }

        [BindProperty]
        public ListaPreciosViewModel MiListaPrecio { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categoria { get; set; }


        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursal { get; set; }

        [BindProperty]
        public SucursalesViewModel MiSucursal { get; set; }


        public IndexModel(ICrudApi<BitacoraMargenesViewModel, int> service, ICrudApi<ListaPreciosViewModel, int> listas, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<ProductosViewModel, string> productos, ICrudApi<SucursalesViewModel, string> sucursales)
        {
            this.service = service;
            this.listas = listas;
            this.categorias = categorias;
            this.productos = productos;
            this.sucursales = sucursales;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "73").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                DateTime time = new DateTime();

                if (time == filtro.FechaInicial)
                {


                    filtro.FechaInicial = DateTime.Now;

                    //filtro.FechaInicial = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime primerDia = new DateTime(filtro.FechaInicial.Year, filtro.FechaInicial.Month, 1);


                    DateTime ultimoDia = primerDia.AddMonths(1).AddDays(-1);

                    filtro.FechaFinal = DateTime.Now;




                }


               
                Categoria = await categorias.ObtenerLista("");
           
               
                Sucursal = await sucursales.ObtenerLista("");
                var Suc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                MiSucursal = Sucursal.Where(a => a.CodSuc.ToUpper().Contains(Suc)).FirstOrDefault();
                ListaPrecio = await listas.ObtenerLista("");
                MiListaPrecio = ListaPrecio.Where(a => a.id == MiSucursal.idListaPrecios).FirstOrDefault();
                if (filtro.Codigo1 == 0 && filtro.Codigo2 == 0)
                {

                    filtro.Codigo2 = MiListaPrecio == null ? 0 : MiListaPrecio.id;
                    filtro.Codigo3 = Categoria.FirstOrDefault() == null ? 0 : Categoria.FirstOrDefault().id;
                }
                
                Objeto = await service.ObtenerLista(filtro);

                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.Externo = true;
                filtro2.Activo = true;
                filtro2.CardName = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                filtro2.CardCode = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                Productos = await productos.ObtenerLista(filtro2);
              



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
