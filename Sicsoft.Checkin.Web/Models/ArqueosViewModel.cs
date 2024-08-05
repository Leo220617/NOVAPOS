using System.Collections.Generic;
using System;

namespace NOVAPOS.Models
{
    public class ArqueosViewModel
    {
        public int id { get; set; }

        public int idCategoria { get; set; }

        public string PalabraClave { get; set; }

        public string CodSuc { get; set; }

        public int idUsuarioCreador { get; set; }

        public DateTime FechaCreacion { get; set; }

        public bool Validado { get; set; }

        public string Status { get; set; }

        public DateTime FechaActualizacion { get; set; }

        public List<DetArqueosViewModel> Detalle { get; set; }
    }
}
