using System;

namespace NOVAAPP.Models
{
    public class DocumentosViewModel
    {
        public int id { get; set; }
        public int idCliente { get; set; }
        public int idUsuarioCreador { get; set; }
        public int idOferta { get; set; }

        public int idCondPago { get; set; }
        public DateTime Fecha { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public string Comentarios { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TotalImpuestos { get; set; }
        public decimal TotalDescuento { get; set; }
        public decimal TotalCompra { get; set; }
        public decimal PorDescto { get; set; }

        public string Status { get; set; }

        public string CodSuc { get; set; }
        public string Moneda { get; set; }

        public string TipoDocumento { get; set; }
        public int idCaja { get; set; }

        public int BaseEntry { get; set; }

        public int idVendedor { get; set; }

        public bool ProcesadaSAP { get; set; }

        public bool PagoProcesadaSAP { get; set; }
        public string ClaveHacienda { get; set; }
        public string ConsecutivoHacienda { get; set; }
        public MetodosPagosViewModel[] MetodosPagos { get; set; }

        public DetDocumentoViewModel[] Detalle { get; set; }

    }
}
