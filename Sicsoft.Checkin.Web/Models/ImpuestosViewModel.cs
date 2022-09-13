using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NOVAAPP.Models
{
    public class ImpuestosViewModel
    {
        public int id { get; set; }

        
        public string Codigo { get; set; }

       
        public decimal Tarifa { get; set; }
    }
}
