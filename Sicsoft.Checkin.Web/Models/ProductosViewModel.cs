using Castle.MicroKernel.SubSystems.Conversion;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NOVAAPP.Models
{
    public class ProductosViewModel
    {

        public int id { get; set; }

        public string Codigo { get; set; }

        public int idBodega { get; set; }

        public int idImpuesto { get; set; }

        public int idListaPrecios { get; set; }

        
        public string Nombre { get; set; }

        public string Moneda { get; set; }
        public decimal PrecioUnitario { get; set; }

        public string UnidadMedida { get; set; }

      
        public string Cabys { get; set; }

       
        public string TipoCod { get; set; }

       
        public string CodBarras { get; set; }

       
        public decimal Costo { get; set; }

       
        public decimal Stock { get; set; }

        public bool Activo { get; set; }

        public bool ProcesadoSAP { get; set; }

        public bool MAG { get; set; }
        public bool Editable { get; set; }

        public bool Serie { get; set; }

    }
}
