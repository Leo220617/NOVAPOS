using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NOVAAPP.Models
{
    public class CierreCajasViewModel
    {
       
        public int idUsuario { get; set; }


        public int idCaja { get; set; }

    
        public DateTime FechaCaja { get; set; }

        public DateTime FecUltAct { get; set; }

      
        public string IP { get; set; }

      
        public decimal EfectivoColones { get; set; }

     
        public decimal ChequesColones { get; set; }  
         
        public decimal TarjetasColones { get; set; }

        
        public decimal OtrosMediosColones { get; set; }

       
        public decimal TotalVendidoColones { get; set; }

       
        public decimal TotalRegistradoColones { get; set; }

       
        public decimal TotalAperturaColones { get; set; }

       
        public decimal EfectivoFC { get; set; }

       
        public decimal ChequesFC { get; set; }

        
        public decimal TarjetasFC { get; set; }

        
        public decimal OtrosMediosFC { get; set; }

        
        public decimal TotalVendidoFC { get; set; }

       
        public decimal TotalRegistradoFC { get; set; }

        
        public decimal TotalAperturaFC { get; set; }

        public bool Activo { get; set; }

        public DateTime HoraCierre { get; set; }

        public decimal TotalizadoMonedas { get; set; }

       
        public decimal TransferenciasColones { get; set; }

       
        public decimal TransferenciasDolares { get; set; }
    }
}
