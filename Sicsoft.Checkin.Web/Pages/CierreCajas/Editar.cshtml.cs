using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;
using Sicsoft.CostaRica.Checkin.Web.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NOVAAPP.Pages.CierreCajas
{
    public class EditarModel : PageModel
    {
        private readonly ICrudApi<CierreCajasViewModel, int> service;

        private readonly ICrudApi<UsuariosViewModel, int> users;
        private readonly ICrudApi<TipoCambiosViewModel, int> tipoCambio;
        private readonly ICrudApi<CajasViewModel, int> cajo;
        private readonly ICrudApi<DocumentosViewModel, int> documento;
        private readonly ICrudApi<MetodosPagosViewModel, int> pagos;
        private readonly ICrudApi<CuentasBancariasViewModel, int> cuenta;


        [BindProperty]
        public CierreCajasViewModel Cierres { get; set; }



        [BindProperty]
        public UsuariosViewModel Users { get; set; }

        [BindProperty]
        public CajasViewModel[] Cajos { get; set; }

        [BindProperty]
        public string Caja { get; set; }
        [BindProperty]
        public TipoCambiosViewModel[] TC { get; set; }


        [BindProperty]
        public DocumentosViewModel[] Documento { get; set; }

        [BindProperty]
        public MetodosPagosViewModel[] Pagos { get; set; }

        [BindProperty]
        public CuentasBancariasViewModel[] CuentasBancarias { get; set; }

        public EditarModel(ICrudApi<CierreCajasViewModel, int> service, ICrudApi<UsuariosViewModel, int> users, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<CajasViewModel, int> cajo, ICrudApi<DocumentosViewModel, int> documento, ICrudApi<MetodosPagosViewModel, int> pagos, ICrudApi<CuentasBancariasViewModel, int> cuenta)
        {
            this.service = service;
            this.users = users;
            this.tipoCambio = tipoCambio;

            this.cajo = cajo;
            this.documento = documento;

            this.pagos = pagos;
            this.cuenta = cuenta;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "35").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Cajos = await cajo.ObtenerLista("");
                var idcaja = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault());
                var Fecha = DateTime.Now.Date;
                var idCajero = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());
                Cierres = await service.ObtenerCierre(idcaja, Fecha, idCajero);
                Users = await users.ObtenerPorId(idCajero);
                Caja =  ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Caja").Select(s1 => s1.Value).FirstOrDefault();

                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.FechaInicial = DateTime.Now.Date;
                filtro.FechaInicial = Cierres.FechaCaja;
                filtro.FechaFinal = Cierres.FechaCaja;
                TC = await tipoCambio.ObtenerLista(filtro);
                filtro.Codigo3 = Cierres.idCaja;

                Documento = await documento.ObtenerLista(filtro);


                filtro.Codigo1 = Cierres.idCaja;
                Pagos = await pagos.ObtenerLista(filtro);
                TC = await tipoCambio.ObtenerLista(filtro);
                CuentasBancarias = await cuenta.ObtenerLista("");

                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }

        public async Task<IActionResult> OnPostAsync()
        {
            try
            {
                await service.Editar(Cierres);
                await HttpContext.SignOutAsync();
                //_logger.LogInformation("User logged out.");

                // This needs to be a redirect so that the browser performs a new
                // request and the identity for the user gets updated.
                // return RedirectToPage();
                string url = "/Account/Login";

                return Redirect("./Index");
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

    }
}
