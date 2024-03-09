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

namespace NOVAAPP.Pages.PreCierres
{
    public class ObservarModel : PageModel
    {
        private readonly ICrudApi<PreCierresViewModel, int> service;

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

        [BindProperty]
        public PreCierresViewModel Cierres { get; set; }



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
        public MetodosPagosAbonosViewModel[] MetodoAbono { get; set; }


        [BindProperty]
        public MetodosPagosCuentasViewModel[] MetodoCuenta { get; set; }

        [BindProperty]
        public CuentasBancariasViewModel[] CuentasBancarias { get; set; }
        [BindProperty]
        public CondicionesPagosViewModel Condicion { get; set; }

        [BindProperty]
        public decimal TotalColones { get; set; }

        [BindProperty]
        public decimal TotalFC { get; set; }

        [BindProperty]
        public decimal Totalizado { get; set; }

        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel[] CondicionC { get; set; }

        [BindProperty]
        public PagoCuentasViewModel[] PagoCuentas { get; set; }

        [BindProperty]
        public DepositosViewModel[] Depositos { get; set; }
        public ObservarModel(ICrudApi<PreCierresViewModel, int> service, ICrudApi<UsuariosViewModel, int> users, ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<CajasViewModel, int> cajo, ICrudApi<DocumentosViewModel, int> documento, ICrudApi<MetodosPagosViewModel, int> pagos, ICrudApi<CuentasBancariasViewModel, int> cuenta, ICrudApi<CondicionesPagosViewModel, int> cond, ICrudApi<ClientesViewModel, string> clientes, ICrudApi<PagoCuentasViewModel, int> pagocuentas, ICrudApi<DepositosViewModel, int> depositos, ICrudApi<MetodosPagosAbonosViewModel, int> metodoabono, ICrudApi<MetodosPagosCuentasViewModel, int> metodocuenta)
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
        }
        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "58").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }
                Cajos = await cajo.ObtenerLista("");
              
                Cierres = await service.ObtenerPorId(id);
                var idCajero = Cierres.idUsuario;

                Users = await users.ObtenerPorId(idCajero);
                Caja = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Caja").Select(s1 => s1.Value).FirstOrDefault();

                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.FechaInicial = DateTime.Now;


                filtro.FechaInicial = Cierres.FechaCaja;
                filtro.FechaFinal = Cierres.FechaCaja;
                TC = await tipoCambio.ObtenerLista(filtro);
                filtro.Codigo3 = Cierres.idCaja;

                Documento = await documento.ObtenerLista(filtro); //Documentos de la fecha de la caja y de la caja
                PagoCuentas = await pagocuentas.ObtenerLista(filtro);
                Depositos = await depositos.ObtenerLista(filtro);
                filtro.Codigo2 = Cierres.idUsuario;
                filtro.Codigo1 = Cierres.idCaja;
                Pagos = await pagos.ObtenerLista(filtro); //aqui nos traemos los pagos de la caja
                MetodoAbono = await metodoabono.ObtenerLista(filtro);
                MetodoCuenta = await metodocuenta.ObtenerLista(filtro);
                ParametrosFiltros filtro2 = new ParametrosFiltros();
                filtro2.Externo = true;
                Clientes = await clientes.ObtenerLista(filtro2);

                CuentasBancarias = await cuenta.ObtenerLista("");

                var Condiciones = await cond.ObtenerLista("");
                Condicion = Condiciones.Where(a => a.Dias == 0).FirstOrDefault();

                CondicionC = await cond.ObtenerLista("");


                //TotalColones = Documento.Where(a => a.Moneda == "CRC" && a.idCondPago == Condicion.id && a.TipoDocumento != "03").Sum(a => a.TotalCompra) - Documento.Where(a => a.Moneda == "CRC" && a.idCondPago == Condicion.id && a.TipoDocumento == "03").Sum(a => a.TotalCompra) + Pagos.Where(a => a.Metodo.ToLower().Contains("pago a cuenta") && a.Moneda == "CRC").Sum(a => a.Monto);
                //TotalFC = Documento.Where(a => a.Moneda == "USD" && a.idCondPago == Condicion.id && a.TipoDocumento != "03").Sum(a => a.TotalCompra) - Documento.Where(a => a.Moneda == "USD" && a.idCondPago == Condicion.id && a.TipoDocumento == "03").Sum(a => a.TotalCompra) + Pagos.Where(a => a.Metodo.ToLower().Contains("pago a cuenta") && a.Moneda == "USD").Sum(a => a.Monto);

                var TotalColonesPagos = Pagos.Where(a => a.Moneda == "CRC").Sum(a => a.Monto) == null ? 0 : Pagos.Where(a => a.Moneda == "CRC").Sum(a => a.Monto);
                var TotalColonesPagosAbonos = MetodoAbono.Where(a => a.Moneda == "CRC").Sum(a => a.Monto) == null ? 0 : MetodoAbono.Where(a => a.Moneda == "CRC").Sum(a => a.Monto);
                var TotalColonesPagosCuenta = MetodoCuenta.Where(a => a.Moneda == "CRC").Sum(a => a.Monto) == null ? 0 : MetodoCuenta.Where(a => a.Moneda == "CRC").Sum(a => a.Monto);

                var TotalPagosFC = Pagos.Where(a => a.Moneda == "USD").Sum(a => a.Monto) == null ? 0 : Pagos.Where(a => a.Moneda == "USD").Sum(a => a.Monto);
                var TotalPagosAbonosFC = MetodoAbono.Where(a => a.Moneda == "USD").Sum(a => a.Monto) == null ? 0 : MetodoAbono.Where(a => a.Moneda == "USD").Sum(a => a.Monto);
                var TotalPagosCuentasFC = MetodoCuenta.Where(a => a.Moneda == "USD").Sum(a => a.Monto) == null ? 0 : MetodoCuenta.Where(a => a.Moneda == "USD").Sum(a => a.Monto);

                TotalColones = TotalColonesPagos + TotalColonesPagosAbonos + TotalColonesPagosCuenta;
                TotalFC = TotalPagosFC + TotalPagosAbonosFC + TotalPagosCuentasFC;

                Totalizado = TotalColones + (TotalFC * TC.Where(a => a.Moneda == "USD").FirstOrDefault().TipoCambio);
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
