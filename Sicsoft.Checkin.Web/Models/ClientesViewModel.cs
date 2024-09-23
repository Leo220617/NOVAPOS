using Castle.MicroKernel.SubSystems.Conversion;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NOVAAPP.Models
{
    public class ClientesViewModel
    {
        public int id { get; set; }

        public string Codigo { get; set; }

        public int idListaPrecios { get; set; }

        
        public string Nombre { get; set; }

        
        public string TipoCedula { get; set; }

        
        public string Cedula { get; set; }

        
        public string Email { get; set; }

        

        public string CodPais { get; set; }

        
        public string Telefono { get; set; }

        public int Provincia { get; set; }

       
        public string Canton { get; set; }

       
        public string Distrito { get; set; }

        
        public string Barrio { get; set; }

        
        public string Sennas { get; set; }

       
        public decimal Saldo { get; set; }

        public bool Activo { get; set; }

        public bool ProcesadoSAP { get; set; }
        public int idCondicionPago { get; set; }

        public string CorreoPublicitario { get; set; }

        public int idGrupo { get; set; }
        public bool MAG { get; set; }
        public bool INT { get; set; }
        public decimal LimiteCredito { get; set; }
        public decimal Descuento { get; set; }

        public bool CxC { get; set; }

        public bool Transitorio { get; set; }
        public string DV { get; set; }

    }
}
