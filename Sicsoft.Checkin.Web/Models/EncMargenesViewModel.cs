using Org.BouncyCastle.Asn1.X509;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace NOVAPOS.Models
{
    public class EncMargenesViewModel
    {

        public int idListaPrecio { get; set; }

        public int idCategoria { get; set; }

        public string Moneda { get; set; }

        public decimal Cobertura { get; set; }

        public decimal Margen { get; set; }

        public decimal MargenMin { get; set; }

        public int idUsuarioCreador { get; set; }

        public DateTime FechaCreacion { get; set; }

        public DetMargenesViewModel[] Detalle { get; set; }

    }
}
