using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InversionGloblalWeb.Models
{
    public class BitacoraErroresViewModel
    {
        public int id { get; set; }
        public string Descripcion { get; set; }
        public DateTime Fecha { get; set; }
        public string StackTrace { get; set; }
    }
}
