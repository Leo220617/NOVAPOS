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
    public class NuevoModel : PageModel
    {
        private readonly ICrudApi<ArqueosViewModel, int> service;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<ProductosViewModel, string> productos;




        [BindProperty]
        public ArqueosViewModel Arqueo { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }



        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }





        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        public NuevoModel(ICrudApi<ArqueosViewModel, int> service, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<BodegasViewModel, int> bodegas, ICrudApi<ProductosViewModel, string> productos)
        {
            this.service = service;
            this.categorias = categorias;
            this.bodegas = bodegas;
            this.productos = productos;

        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles1 = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles1.Where(a => a == "72").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
            
                Categorias = await categorias.ObtenerLista("");

                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                Bodegas = await bodegas.ObtenerLista(filtro2);

                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;
                filtro.CardName = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                filtro.CardCode = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                Productos = await productos.ObtenerLista(filtro);

           



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