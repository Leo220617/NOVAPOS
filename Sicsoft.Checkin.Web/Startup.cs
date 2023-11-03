using System;
using System.Globalization;
using InversionGloblalWeb.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NOVAAPP.Models;
using NOVAPOS.Models;
using Refit;
using Sicsoft.Checkin.Web.Models;
using Sicsoft.Checkin.Web.Servicios;
using Sicsoft.CostaRica.Checkin.Web.Models;

namespace Sicsoft.Checkin.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
           .AddCookie(options =>
           {
               options.ExpireTimeSpan = TimeSpan.FromMinutes(240);
           });

            services.AddHttpContextAccessor();

            services.AddScoped<AuthenticatedHttpClientHandler>();

            services.AddApiServices(Configuration);

            services.AddControllersWithViews()
                .AddRazorRuntimeCompilation();

            services.AddRazorPages()
                .AddMvcOptions(options =>
                {

                    options.Filters.Add(new AuthorizeFilter());
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseStatusCodePagesWithReExecute("/StatusCode", "?code={0}");

            app.UseHttpsRedirection();

            var supportedCultures = new[]
            {
                new CultureInfo("en-US"), //es-cr

            };

            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("en-US"),

                // Formatting numbers, dates, etc.
                SupportedCultures = supportedCultures,
                // UI strings that we have localized.
                SupportedUICultures = supportedCultures
            });

            app.UseStaticFiles();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
            });
        }
    }

    public static class CheckinServiceCollectionExtensions
    {
        public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration Configuration)
        {


            services.AddRefitClient<ICrudApi<LoginDevolucion, int>>()
            .ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Login/ConectarPOS"));
            // Add additional IHttpClientBuilder chained methods as required here:
            //  .AddHttpMessageHandler<AuthenticatedHttpClientHandler>()
            // .SetHandlerLifetime(TimeSpan.FromMinutes(2));

            services.AddRefitClient<ICrudApi<SucursalesViewModel, string>>()
     .ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Sucursales"));

            services.AddRefitClient<ICrudApi<CajasViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Cajas")) ;

            services.AddRefitClient<ICrudApi<LoginUsuario, int>>()
            .ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Login"))
            .AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<LoginUsuarioViewModel, int>>()
            .ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Login"))
            .AddHttpMessageHandler<AuthenticatedHttpClientHandler>();
        

            services.AddRefitClient<ICrudApi<UsuariosViewModel, int>>()
           .ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Usuarios"))
           .AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<RolesViewModel, int>>()
            .ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Roles"))
            .AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

             
            services.AddRefitClient<ICrudApi<SeguridadModulosViewModel, int>>()
      .ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/SeguridadModulos"))
      .AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            services.AddRefitClient<ICrudApi<SeguridadRolesModulosViewModel, int>>()
      .ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/SeguridadRolesModulos"))
      .AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

           


            services.AddRefitClient<ICrudApi<BitacoraErroresViewModel, int>>()
   .ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Bitacora"))
   .AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<BitacoraMovimientosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Bitacoramovimientos"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            services.AddRefitClient<ICrudApi<BodegasViewModel, int>>()
 .ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Bodegas"))
 .AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<CabysViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Cabys"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            

            services.AddRefitClient<ICrudApi<ClientesViewModel, string>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Clientes"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            services.AddRefitClient<ICrudApi<ImpuestosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Impuestos"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            services.AddRefitClient<ICrudApi<ListaPreciosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/ListaPrecios"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<ProductosViewModel, string>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Productos"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            services.AddRefitClient<ICrudApi<UsuariosSucursalesViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/UsuariosSucursales"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<CantonesViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Cantones"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            services.AddRefitClient<ICrudApi<BarriosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Barrios"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<DistritosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Distritos"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<CorreoEnvioViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/CorreoEnvio"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<OfertasViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Ofertas"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<CondicionesPagosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/CondicionesPagos"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<ExoneracionesViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Exoneraciones"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            services.AddRefitClient<ICrudApi<GruposClientesViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/GruposClientes"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            services.AddRefitClient<ICrudApi<TipoCambiosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/TipoCambios"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<DocumentosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Documentos"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<CierreCajasViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/CierreCajas"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<CuentasBancariasViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/CuentasBancarias"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<VendedoresViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Vendedores"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<MetodosPagosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/MetodosPagos"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<PagosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Pagos"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<DocumentosCreditoViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/DocumentosCredito"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            services.AddRefitClient<ICrudApi<CuentasSAPViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/CuentasSAP"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<DepositosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Depositos"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<PagoCuentasViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/PagoCuentas"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<SeriesProductosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/SeriesProductos"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            services.AddRefitClient<ICrudApi<PreCierresViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/PreCierres"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            services.AddRefitClient<ICrudApi<ParametrosViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/Parametros"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

            services.AddRefitClient<ICrudApi<PromocionesViewModel, int>>()
.ConfigureHttpClient(c => c.BaseAddress = new Uri($"{Configuration["UrlWebApi"]}/api/DetPromociones"))
.AddHttpMessageHandler<AuthenticatedHttpClientHandler>();


            return services;
        }
    }
}
