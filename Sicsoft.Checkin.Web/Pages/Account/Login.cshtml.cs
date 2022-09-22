using System;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Threading.Tasks;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Models;
using Sicsoft.Checkin.Web.Servicios;
using Sicsoft.CostaRica.Checkin.Web.Models;

namespace Sicsoft.Checkin.Web
{
    [AllowAnonymous]
    public class LoginModel : PageModel
    {
        private readonly ICrudApi<LoginDevolucion,int> checkInService;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<CajasViewModel, int> cajas;



        [BindProperty]
        public LoginViewModel Input { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }

        public LoginModel(ICrudApi<LoginDevolucion, int> checkInService, ICrudApi<SucursalesViewModel, string> sucursales, ICrudApi<CajasViewModel, int> cajas)
        {
            this.checkInService = checkInService;
            this.sucursales = sucursales;
            this.cajas = cajas;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                Sucursales = await sucursales.ObtenerLista("");
                return Page();
            }
            catch (ApiException ex)
            {
                Errores error = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, error.Message);

                return Page();
            }
        }

        public async Task<IActionResult> OnGetCajas(string CodSuc)
        {
            try
            {
                var cajas1 = await cajas.ObtenerLista("");
                cajas1 = cajas1.Where(a => a.CodSuc == CodSuc).ToArray();
               
                return new JsonResult(cajas1);
            }
            catch (ApiException ex)
            {
                var cajas1 = new CajasViewModel[0];
                return new JsonResult(cajas1);
            }
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                await HttpContext.SignOutAsync();
                return Page();
            }
            ActionResult response = Page();
            try
            {
                var ip = Request.HttpContext.Connection.RemoteIpAddress.ToString();
                var resultado = await checkInService.Login(Input.CodSuc, Input.idCaja,Input.nombreUsuario, Input.clave, ip);
                string str = "";

                foreach(var item in resultado.Seguridad)
                {
                    str += item.CodModulo + "|";
                }


                var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
                identity.AddClaim(new Claim(ClaimTypes.Name, resultado.Email));
                identity.AddClaim(new Claim(ClaimTypes.UserData, resultado.token));
                //identity.AddClaim(new Claim(ClaimTypes.Actor, resultado.idLogin.ToString()));
                identity.AddClaim(new Claim(ClaimTypes.Role, resultado.idRol.ToString()));
                identity.AddClaim(new Claim("Roles",str));
                identity.AddClaim(new Claim("CodSuc", resultado.CodSuc.ToString()));
                identity.AddClaim(new Claim("Caja", resultado.Caja.ToString()));
                identity.AddClaim(new Claim("idCaja", resultado.idCaja.ToString()));
                identity.AddClaim(new Claim("idCierre", resultado.idCierre.ToString()));



                var principal = new ClaimsPrincipal(identity);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

                

                return Redirect("../Index");


            }
            catch (ValidationApiException)
            {
                // handle validation here by using validationException.Content,
                // which is type of ProblemDetails according to RFC 7807

                // If the response contains additional properties on the problem details,
                // they will be added to the validationException.Content.Extensions collection.
            }
            catch (ApiException exception)
            {
                if(exception.StatusCode == System.Net.HttpStatusCode.BadRequest)
                {
                    Errores error = JsonConvert.DeserializeObject<Errores>(exception.Content.ToString());
                    ModelState.AddModelError("User name", error.Message);
                    return Page();
                }
                else
                {
                    Errores error = JsonConvert.DeserializeObject<Errores>(exception.Content.ToString());
                    ModelState.AddModelError("User name", error.Message);
                    return Page();
                }
               
            }
            catch(Exception ex)
            {
                ModelState.AddModelError("User name", ex.Message);
                return Page();
            }
           
            return response;


        }
    }
}