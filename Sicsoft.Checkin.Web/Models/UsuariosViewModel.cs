using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NOVAAPP.Models
{
    public class UsuariosViewModel
    {
        public int id { get; set; }

        public int idRol { get; set; }

        
        public string Nombre { get; set; }

      
        public string NombreUsuario { get; set; }

        public string Clave { get; set; }

        
        public string ClaveSupervision { get; set; }

        public DateTime FecUltSup { get; set; }

        public bool Activo { get; set; }

        public bool novapos { get; set; }

        public int idVendedor { get; set; }

        public decimal Descuento { get; set; }
    }
}
