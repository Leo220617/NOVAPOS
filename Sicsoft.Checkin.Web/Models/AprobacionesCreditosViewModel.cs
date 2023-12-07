using System;

namespace NOVAAPP.Models
{
    public class AprobacionesCreditosViewModel
    {
        public int id { get; set; }

        public int idCliente { get; set; }

        public int idUsuarioCreador { get; set; }

        public int idUsuarioAceptador { get; set; }

        public DateTime FechaCreacion { get; set; }

        public string Status { get; set; }

        public bool Activo { get; set; }

        public decimal Total { get; set; }

        public decimal TotalAprobado { get; set; }
    }
}
