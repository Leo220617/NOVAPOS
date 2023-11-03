using System;

namespace NOVAPOS.Models
{
    public class PromocionesViewModel
    {
        public int id { get; set; }

        public int idEncabezado { get; set; }

        public string ItemCode { get; set; }

        public int idCategoria { get; set; }


        public int idListaPrecio { get; set; }

        public string Moneda { get; set; }

        public decimal PrecioFinal { get; set; }

        public decimal PrecioAnterior { get; set; }

        public DateTime FechaVen { get; set; }

        public DateTime Fecha { get; set; }
    }
}
