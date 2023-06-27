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

namespace NOVAAPP.Pages.Depositos
{
    public class NuevoModel : PageModel
    {
        private readonly ICrudApi<DepositosViewModel, int> service; //API
        private readonly ICrudApi<UsuariosViewModel, int> usuario;
        private readonly ICrudApi<CuentasSAPViewModel, int> cuentas;
        private readonly ICrudApi<CuentasBancariasViewModel, int> serviceCB;
        private readonly ICrudApi<CierreCajasViewModel, int> cierres;


        [BindProperty]
        public DepositosViewModel Deposito { get; set; }


        [BindProperty]
        public DepositosViewModel[] Lista { get; set; }


        [BindProperty]
        public UsuariosViewModel USU { get; set; }

        [BindProperty]
        public CuentasBancariasViewModel[] CB { get; set; }

        [BindProperty]
        public CuentasSAPViewModel Cuentas { get; set; }

        [BindProperty]
        public CierreCajasViewModel Cierres { get; set; }

        public NuevoModel(ICrudApi<DepositosViewModel, int> service, ICrudApi<UsuariosViewModel, int> usuario, ICrudApi<CuentasSAPViewModel, int> cuentas, ICrudApi<CuentasBancariasViewModel, int> serviceCB, ICrudApi<CierreCajasViewModel, int> cierres)
        {
            this.service = service;
            this.usuario = usuario;
            this.cuentas = cuentas;
            this.serviceCB = serviceCB;
            this.cierres = cierres;
        }



        public async Task<IActionResult> OnGetAsync()
        {
           
             try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "54").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }



                var idcaja = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault());
                var Fecha = DateTime.Now.Date;
                var idCajero = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());
                Cierres = await cierres.ObtenerCierre(idcaja, Fecha, idCajero);

                var idUsuario = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());
                USU = await usuario.ObtenerPorId(idUsuario);

                ParametrosFiltros FiltroCB = new ParametrosFiltros();
                FiltroCB.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                CB = await serviceCB.ObtenerLista(FiltroCB);
                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.FechaInicial = DateTime.Now.Date;

                filtro.Texto = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault();
                filtro.Codigo3 = idcaja;

                Lista = await service.ObtenerLista(filtro);
                Cuentas = await cuentas.ObtenerListaEspecial("");


                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }

        public async Task<IActionResult> OnPostAgregarDeposito(DepositosViewModel recibidos)
        {
            string error = "";


            try
            {
                recibidos.CodSuc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                recibidos.idUsuarioCreador = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault().ToString());
                recibidos.idCaja = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault());

                var resp = await service.Agregar(recibidos);

                var resp2 = new
                {
                    success = true,
                    Deposito = resp
                };
                return new JsonResult(resp2);
            }
            catch (ApiException ex)
            {
                Errores errores = JsonConvert.DeserializeObject<Errores>(ex.Content.ToString());
                ModelState.AddModelError(string.Empty, errores.Message);
                return new JsonResult(error);
                //return new JsonResult(false);
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                var resp2 = new
                {
                    success = false,
                    Deposito = ""
                };
                return new JsonResult(resp2);
            }
        }

    }
}
