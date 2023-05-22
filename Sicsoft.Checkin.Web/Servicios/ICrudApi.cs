using Refit;
using Sicsoft.Checkin.Web.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sicsoft.Checkin.Web.Servicios
{
     

    public interface ICrudApi<TEntity, TKey> where TEntity : class
    {
       
        [Post("")]
        Task<TEntity[]> AgregarBulk([Body] TEntity[] payload);

        [Post("/Insertar")]
        Task<TEntity> Agregar([Body] TEntity payload);
        [Post("")]
        Task<TEntity> CambiarClave([Body] TEntity payload);

        [Get("")]
        Task<TEntity> Login(string CodSuc, int idCaja, string nombreUsuario, string clave, string ip);

        [Get("/InsertarSAP")]
        Task<TEntity> InsertarSAP();


        [Get("")]
        Task<TEntity[]> ObtenerLista<TQuery>(TQuery q);



        [Get("/Emision")]
        Task<TEntity[]> GenerarEmision<TQuery>(TQuery q);

        [Get("/InsertarOrdenes")]
        Task<TEntity[]> InsertarOrdenes<TQuery>(TQuery q);

        [Get("/Recibo")]
        Task<TEntity[]> GenerarRecibo<TQuery>(TQuery q);

        [Get("/")]
        Task<TEntity> ObtenerListaEspecial<TQuery>(TQuery q);

        [Get("/SincronizarSAP")]
        Task<TEntity> SincronizarSAP(int id);

        [Get("/Consultar")]
        Task<TEntity> ObtenerPorId(int id);

        [Get("/Consultar")]
        Task<TEntity> ObtenerCierre(int id, DateTime Fecha, int idUsuario);

        [Put("/Actualizar")]
        Task Editar( [Body]TEntity payload);
 
        [Delete("/Eliminar")]
        Task Eliminar(int id);

        [Post("/Eliminar")]
        Task EliminarUsuario(int id, string CedulaJuridica);

        [Get("/ConsultarByClient")]
        Task<TEntity[]> ObtenerFacturaC(int idCliente);






    }
}
