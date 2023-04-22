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
using NOVAAPP.Models;
using Refit;
using Sicsoft.Checkin.Web.Servicios;


namespace NOVAAPP.Pages.Pagos
{
    public class NuevoModel : PageModel
    {
        private readonly ICrudApi<PagosViewModel, int> service; //API
       
        private readonly ICrudApi<ClientesViewModel, string> clientes;
        private readonly ICrudApi<ProductosViewModel, string> productos;
        private readonly ICrudApi<SucursalesViewModel, string> sucursales;
        private readonly ICrudApi<DocumentosCreditoViewModel, int> documentos;
     
    
        private readonly ICrudApi<TipoCambiosViewModel, int> tipoCambio;
        private readonly ICrudApi<CondicionesPagosViewModel, int> serviceCP; //API

        private readonly ICrudApi<VendedoresViewModel, int> vendedor;
  

   


        [BindProperty]
        public PagosViewModel Pago { get; set; }

        [BindProperty]
        public SucursalesViewModel[] Sucursales { get; set; }
        [BindProperty]
        public ClientesViewModel[] Clientes { get; set; }

        [BindProperty]
        public ProductosViewModel[] Productos { get; set; }

        [BindProperty]
        public DocumentosCreditoViewModel[] DocumentosC { get; set; }


        [BindProperty]
        public DocumentosCreditoViewModel DocumentosC2 { get; set; }


        [BindProperty]
        public TipoCambiosViewModel[] TP { get; set; }

        [BindProperty]
        public CondicionesPagosViewModel[] CP { get; set; }

     

        [BindProperty]
        public int idVendedor { get; set; }

        

        [BindProperty]
        public VendedoresViewModel[] Vendedores { get; set; }




        public NuevoModel(ICrudApi<PagosViewModel, int> service,  ICrudApi<ClientesViewModel, string> clientes, ICrudApi<ProductosViewModel, string> productos, ICrudApi<SucursalesViewModel, string> sucursales,  ICrudApi<TipoCambiosViewModel, int> tipoCambio, ICrudApi<CondicionesPagosViewModel, int> serviceCP, ICrudApi<VendedoresViewModel, int> vendedor, ICrudApi<DocumentosCreditoViewModel, int> documentos) //CTOR 
        {
            this.service = service;
            this.clientes = clientes;
            this.productos = productos;
            this.sucursales = sucursales;
            this.documentos = documentos;
            this.tipoCambio = tipoCambio;
            this.serviceCP = serviceCP;
            this.vendedor = vendedor;
        
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            try
            {
                var Roles = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "Roles").Select(s1 => s1.Value).FirstOrDefault().Split("|");
                if (string.IsNullOrEmpty(Roles.Where(a => a == "20").FirstOrDefault()))
                {
                    return RedirectToPage("/NoPermiso");
                }

              

                CP = await serviceCP.ObtenerLista("");
                var idUsuario = Convert.ToInt32(((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == ClaimTypes.Actor).Select(s1 => s1.Value).FirstOrDefault());
              


                ParametrosFiltros filtro = new ParametrosFiltros();
                filtro.Externo = true;
                filtro.Activo = true;
                filtro.CardName = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
                Clientes = await clientes.ObtenerLista(filtro);

                Productos = await productos.ObtenerLista("");
                filtro.FechaInicial = DateTime.Now.Date;
                TP = await tipoCambio.ObtenerLista(filtro);
                Vendedores = await vendedor.ObtenerLista(filtro);
                Vendedores = Vendedores.Where(a => a.Activo == true).ToArray();

                return Page();
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, ex.Message);
                return Page();
            }
        }

        public async Task<IActionResult> OnGetFacturas(int idCliente)
        {
            try
            {



                ParametrosFiltros filtros = new ParametrosFiltros();
                filtros.Codigo1 = idCliente;
                
                var objetos = await documentos.ObtenerLista(filtros);

                var objeto = objetos.ToList();



                return new JsonResult(objeto);
            }
            catch (ApiException ex)
            {



                return new JsonResult(ex.Content.ToString());
            }
            catch (Exception ex)
            {



                return new JsonResult(ex.Message.ToString());
            }
        }


        public async Task<IActionResult> OnPostAgregarPago(PagosViewModel recibidos)
        {
            string error = "";


            try
            {
                recibidos.CodSuc = ((ClaimsIdentity)User.Identity).Claims.Where(d => d.Type == "CodSuc").Select(s1 => s1.Value).FirstOrDefault().ToString();
             
                var resp = await service.Agregar(recibidos);
                //if (recibidos.TotalPagado > 0)
                //{
                //    await service.Eliminar(recibidos.TotalPagado);

                //}
                var resp2 = new
                {
                    success = true,
                    Pago = resp
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
                    Pago = ""
                };
                return new JsonResult(resp2);
            }
        }


    }
}
