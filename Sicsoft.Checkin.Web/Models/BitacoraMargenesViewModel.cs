using System;

namespace NOVAPOS.Models
{
    public class BitacoraMargenesViewModel
    {
        public int id { get; set; }

        public string ItemCode { get; set; }

        public int idCategoria { get; set; }

        public int idListaPrecio { get; set; }

        public decimal PrecioAnterior { get; set; }

        public decimal PrecioNuevo { get; set; }

        public DateTime Fecha { get; set; }
    }
}
