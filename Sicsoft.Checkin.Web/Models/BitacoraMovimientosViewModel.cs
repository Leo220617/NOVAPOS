using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace NOVAAPP.Models
{
    public class BitacoraMovimientosViewModel
    {
        public int id { get; set; }

        public int idUsuario { get; set; }

        
        public string Descripcion { get; set; }

        public DateTime Fecha { get; set; }

      
        public string Metodo { get; set; }
    }
}
