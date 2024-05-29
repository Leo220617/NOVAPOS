namespace NOVAPOS.Models
{
    public class DetMargenesViewModel
    {
        public int id { get; set; }

        public string ItemCode { get; set; }

        public int idListaPrecio { get; set; }

        public int idCategoria { get; set; }

        public string Moneda { get; set; }

        public decimal PrecioSAP { get; set; }

        public decimal Cobertura { get; set; }

        public decimal Margen { get; set; }

        public decimal MargenMin { get; set; }

        public decimal PrecioFinal { get; set; }

        public decimal PrecioMin { get; set; }
        public decimal PrecioCob { get; set; }
    }
}
