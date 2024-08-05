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
using System.IO.Compression;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAPOS.Pages.Arqueos
{
    public class EditarModel : PageModel
    {
        private readonly ICrudApi<ArqueosViewModel, int> service;
        private readonly ICrudApi<CategoriasViewModel, int> categorias;
        private readonly ICrudApi<BodegasViewModel, int> bodegas;
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;




        [BindProperty]
        public ArqueosViewModel Arqueo { get; set; }

        [BindProperty]
        public CategoriasViewModel[] Categorias { get; set; }



        [BindProperty]
        public BodegasViewModel[] Bodegas { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        [BindProperty]
        public SucursalesViewModel MiSucursal { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursal { get; set; }



        [BindProperty(SupportsGet = true)]
        public ParametrosFiltros filtro { get; set; }

        public EditarModel(ICrudApi<ArqueosViewModel, int> service, ICrudApi<CategoriasViewModel, int> categorias, ICrudApi<BodegasViewModel, int> bodegas, ICrudApi<ProductosViewModel, string> productos, ICrudApi<SucursalesViewModel, string> sucursales)
        {
            this.service = service;
            this.categorias = categorias;
            this.bodegas = bodegas;
            this.productos = productos;
            this.sucursales = sucursales;

        }

        public async Task<IActionResult> OnGetAsync(int id)
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


                var Suc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                Sucursal = await sucursales.ObtenerLista("");
                MiSucursal = Sucursal.Where(a => a.CodSuc.ToUpper().Contains(Suc)).FirstOrDefault();

                Arqueo = await service.ObtenerPorId(id);




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

        public async Task<IActionResult> OnPostAgregarArqueo()
        {
            string error = "";

            ArqueosViewModel recibidos = new ArqueosViewModel();
            try
            {
                var ms = new MemoryStream();
                await Request.Body.CopyToAsync(ms);

                byte[] compressedData = ms.ToArray();

                // Descomprimir los datos utilizando GZip
                using (var compressedStream = new MemoryStream(compressedData))
                using (var decompressedStream = new MemoryStream())
                {
                    using (var decompressionStream = new GZipStream(compressedStream, CompressionMode.Decompress))
                    {
                        decompressionStream.CopyTo(decompressedStream);
                    }

                    // Convertir los datos descomprimidos a una cadena JSON
                    var jsonString = System.Text.Encoding.UTF8.GetString(decompressedStream.ToArray());

                    // Procesar la cadena JSON como desees
                    // Por ejemplo, puedes deserializarla a un objeto C# utilizando Newtonsoft.Json
                    recibidos = Newtonsoft.Json.JsonConvert.DeserializeObject<ArqueosViewModel>(jsonString);
                }




                recibidos.CodSuc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                recibidos.idUsuarioCreador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());


                await service.Editar(recibidos);

                var resp2 = new
                {
                    success = true,
                    Arqueo = ""

                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                BitacoraErroresViewModel be = JsonConvert.DeserializeObject<BitacoraErroresViewModel>(ex.Content.ToString());
                var resp2 = new
                {
                    success = false,
                    Arqueo = be.Descripcion
                };
                return new JsonResult(resp2);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Arqueo = ex.Message
                };
                return new JsonResult(resp2);
            }
        }

    }
}