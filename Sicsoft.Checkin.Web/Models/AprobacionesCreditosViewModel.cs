using System;

namespace NOVAAPP.Models
{
    public class AprobacionesCreditosViewModel
    {
        public int id { get; set; }

        public int idCliente { get; set; }

        public DateTime FechaCreacion { get; set; }

        public string Status { get; set; }

        public bool Activo { get; set; }

        public decimal Total { get; set; }
    }
}
