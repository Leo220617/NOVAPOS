using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NOVAAPP.Models
{
    public class CajasViewModel
    {
        public int id { get; set; }

      
        public string CodSuc { get; set; }

       
        public string Nombre { get; set; }

        public decimal MontoAperturaColones { get; set; }

        public decimal MontoAperturaDolares { get; set; }
        public int idUsuario { get; set; }
    }
}
