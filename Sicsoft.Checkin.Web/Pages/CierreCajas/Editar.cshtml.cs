using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Authentication;
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
        private readonly ICrudApi<CondicionesPagosViewModel, int> cond;
        private readonly ICrudApi<ClientesViewModel, string> clientes;
        private readonly ICrudApi<PagoCuentasViewModel, int> pagocuentas;
        private readonly ICrudApi<DepositosViewModel, int> depositos;
        private readonly ICrudApi<MetodosPagosAbonosViewModel, int> metodoabono;
        private readonly ICrudApi<MetodosPagosCuentasViewModel, int> metodocuenta;
        private readonly ICrudApi<ParametrosViewModel, int> param;

        [BindProperty]
        public CierreCajasViewModel Cierres { get; set; }



        [BindProperty]
        public UsuariosViewModel Users { get; set; }

        [BindProperty]
        public CajasViewModel[] Cajos { get; set; }

        [BindProperty]
        public string Caja { get; set; }


        [BindProperty]
        public string Pais { get; set; }
        [BindProperty]
        public TipoCambiosViewModel[] TC { get; set; }


        [BindProperty]
        public DocumentosViewModel[] Documento { get; set; }

        [BindProperty]
        public MetodosPagosViewModel[] Pagos { get; set; }
        [BindProperty]
        public MetodosPagosAbonosViewModel[] MetodoAbono { get; set; }


        [BindProperty]
        public MetodosPagosCuentasViewModel[] MetodoCuenta { get; set; }


        [BindProperty]
        public decimal TotalColones { get; set; }

        [BindProperty]
        public decimal TotalFC { get; set; }

        [BindProperty]
        public decimal Totalizado { get; set; }



        [BindProperty]
        public decimal TotalColonesD { get; set; }

        [BindProperty]
        public decimal TotalFCD { get; set; }
        [BindProperty]
        public decimal TotalizadoD { get; set; }


        [BindProperty]
        public CuentasBancariasViewModel[] CuentasBancarias { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel Condicion { get; set; }
        [BindProperty]

        public string Anterior { get; set; }


        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel[] CondicionC { get; set; }

        [BindProperty]
        public PagoCuentasViewModel[] PagoCuentas { get; set; }

        [BindProperty]
        public DepositosViewModel[] Depositos { get; set; }

        [BindProperty]
        public ParametrosViewModel[] Parametros { get; set; }

        public EditarModel(ICrudApi<CierreCajasViewModel, int> service, ICrudApi<UsuariosViewModel, int> users, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<CajasViewModel, int> cajo, ICrudApi<DocumentosViewModel, int> documento, ICrudApi<MetodosPagosViewModel, int> pagos, ICrudApi<CuentasBancariasViewModel, int> cuenta, ICrudApi<CondicionesPagosViewModel, int> cond, ICrudApi<ClientesViewModel, string> clientes, ICrudApi<PagoCuentasViewModel, int> pagocuentas, ICrudApi<DepositosViewModel, int> depositos, ICrudApi<MetodosPagosAbonosViewModel, int> metodoabono, ICrudApi<MetodosPagosCuentasViewModel, int> metodocuenta, ICrudApi<ParametrosViewModel, int> param)
        {
            this.service = service;
            this.users = users;
            this.tipoCambio = tipoCambio;

            this.cajo = cajo;
            this.documento = documento;
            this.cond = cond;
            this.pagos = pagos;
            this.cuenta = cuenta;
            this.clientes = clientes;
            this.pagocuentas = pagocuentas;
            this.depositos = depositos;
            this.metodoabono = metodoabono;
            this.metodocuenta = metodocuenta;
            this.param  = param;
        }
        public async Task<IActionResult> OnGetAsync(DateTime DiaAnterior)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "35").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Cajos = await cajo.ObtenerLista("");
                var time = new DateTime();
                if (DiaAnterior != time)
                {
                    Anterior = "SI";
                    ParametrosFiltros filtro2 = new ParametrosFiltros();
                    filtro2.Externo = true; // para traer los activos
                    filtro2.Codigo2 = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault().ToString());
                    filtro2.FechaInicial = DiaAnterior;
                    filtro2.FechaFinal = DiaAnterior;
                    filtro2.Activo = true;

                    var Cierre = await service.ObtenerLista(filtro2);
                    Cierre = Cierre.Where(a => a.FechaCaja == DiaAnterior).ToArray();


                    var idcaja = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault());
                    var Fecha = DiaAnterior.Date;
                    var idCajero = Cierre.FirstOrDefault().idUsuario;
                    Cierres = await service.ObtenerCierre(idcaja, Fecha, idCajero);
                    Users = await users.ObtenerPorId(idCajero);
                    Caja = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Caja").Select(s1 => s1.Value).FirstOrDefault();

                    ParametrosFiltros filtro = new ParametrosFiltros();
                    filtro.FechaInicial = DateTime.Now.Date;
                    filtro.FechaInicial = Cierres.FechaCaja;
                    filtro.FechaFinal = Cierres.FechaCaja;
                    TC = await tipoCambio.ObtenerLista(filtro);
                    filtro.Codigo3 = Cierres.idCaja;

                    Documento = await documento.ObtenerLista(filtro);
                    PagoCuentas = await pagocuentas.ObtenerLista(filtro);
                    Depositos = await depositos.ObtenerLista(filtro);

                    filtro.Codigo1 = Cierres.idCaja;
                    Pagos = await pagos.ObtenerLista(filtro);
                    MetodoAbono = await metodoabono.ObtenerLista(filtro);
                    MetodoCuenta = await metodocuenta.ObtenerLista(filtro);
                    TC = await tipoCambio.ObtenerLista(filtro);
                    CuentasBancarias = await cuenta.ObtenerLista("");

                    var Condiciones = await cond.ObtenerLista("");
                    Condicion = Condiciones.Where(a => a.Dias == 0).FirstOrDefault();
                    ParametrosFiltros filtro3 = new ParametrosFiltros();
                    filtro3.Externo = true;
                    Clientes = await clientes.ObtenerLista(filtro3);

                    Parametros = await param.ObtenerLista("");
                    Pais = Parametros.FirstOrDefault().Pais == null ? "" : Parametros.FirstOrDefault().Pais;



                    return Page();
                }
                else
                {
                    Anterior = "NO";

                    var idcaja = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "idCaja").Select(s1 => s1.Value).FirstOrDefault());
                    var Fecha = DateTime.Now.Date;
                    var idCajero = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());
                    Cierres = await service.ObtenerCierre(idcaja, Fecha, idCajero);
                    Users = await users.ObtenerPorId(idCajero);
                    Caja = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Caja").Select(s1 => s1.Value).FirstOrDefault();

                    ParametrosFiltros filtro = new ParametrosFiltros();
                    filtro.FechaInicial = DateTime.Now.Date;
                    filtro.FechaInicial = Cierres.FechaCaja;
                    filtro.FechaFinal = Cierres.FechaCaja;
                    TC = await tipoCambio.ObtenerLista(filtro);
                    filtro.Codigo3 = Cierres.idCaja;

                    Documento = await documento.ObtenerLista(filtro);
                    PagoCuentas = await pagocuentas.ObtenerLista(filtro);
                    Depositos = await depositos.ObtenerLista(filtro);

                    filtro.Codigo1 = Cierres.idCaja;
                    filtro.Codigo2 = Cierres.idUsuario;
                    Pagos = await pagos.ObtenerLista(filtro);
                    TC = await tipoCambio.ObtenerLista(filtro);
                    CuentasBancarias = await cuenta.ObtenerLista("");

                    var Condiciones = await cond.ObtenerLista("");
                    Condicion = Condiciones.Where(a => a.Dias == 0).FirstOrDefault();
                    CondicionC = await cond.ObtenerLista("");


                    ParametrosFiltros filtro2 = new ParametrosFiltros();
                    filtro2.Externo = true;
                    Clientes = await clientes.ObtenerLista(filtro2);
                    MetodoAbono = await metodoabono.ObtenerLista(filtro);
                    MetodoCuenta = await metodocuenta.ObtenerLista(filtro);
                 


                    Parametros = await param.ObtenerLista("");
                    Pais = Parametros.FirstOrDefault().Pais == null ? "" : Parametros.FirstOrDefault().Pais;


                    var TotalColonesPagos = Pagos.Where(a => a.Moneda == "CRC").Sum(a => a.Monto) == null ? 0 : Pagos.Where(a => a.Moneda == "CRC").Sum(a => a.Monto);
                    var TotalColonesPagosAbonos = MetodoAbono.Where(a => a.Moneda == "CRC").Sum(a => a.Monto) == null ? 0 : MetodoAbono.Where(a => a.Moneda == "CRC").Sum(a => a.Monto);
                    var TotalColonesPagosCuenta = MetodoCuenta.Where(a => a.Moneda == "CRC").Sum(a => a.Monto) == null ? 0 : MetodoCuenta.Where(a => a.Moneda == "CRC").Sum(a => a.Monto);

                    var TotalPagosFC = Pagos.Where(a => a.Moneda == "USD").Sum(a => a.Monto) == null ? 0 : Pagos.Where(a => a.Moneda == "USD").Sum(a => a.Monto);
                    var TotalPagosAbonosFC = MetodoAbono.Where(a => a.Moneda == "USD").Sum(a => a.Monto) == null ? 0 : MetodoAbono.Where(a => a.Moneda == "USD").Sum(a => a.Monto);
                    var TotalPagosCuentasFC = MetodoCuenta.Where(a => a.Moneda == "USD").Sum(a => a.Monto) == null ? 0 : MetodoCuenta.Where(a => a.Moneda == "USD").Sum(a => a.Monto);

                    TotalColones = TotalColonesPagos + TotalColonesPagosAbonos + TotalColonesPagosCuenta;
                    TotalFC = TotalPagosFC + TotalPagosAbonosFC + TotalPagosCuentasFC;


                    if (Parametros.FirstOrDefault().Pais == "P")
                    {
                        Totalizado = TotalFC;
                    }
                    else
                    {
                        Totalizado = TotalColones + (TotalFC * TC.Where(a => a.Moneda == "USD").FirstOrDefault().TipoCambio);
                    }

                    TotalColonesD = Depositos.Where(a => a.Moneda == "CRC").Sum(a => a.Saldo) == null ? 0 : Depositos.Where(a => a.Moneda == "CRC").Sum(a => a.Saldo);
                    TotalFCD = Depositos.Where(a => a.Moneda == "USD").Sum(a => a.Saldo) == null ? 0 : Depositos.Where(a => a.Moneda == "USD").Sum(a => a.Saldo);
                    TotalizadoD = TotalColonesD + (TotalFCD * TC.Where(a => a.Moneda == "USD").FirstOrDefault().TipoCambio);
                    return Page();
                }
               
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
