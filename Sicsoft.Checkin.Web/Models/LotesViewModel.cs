namespace NOVAAPP.Models
{
    public class LotesViewModel
    {
        public int id { get; set; }
        public int idEncabezado { get; set; }
        public int idDetalle { get; set; }
        public string Tipo { get; set; }
        public string Serie { get; set; }
        public string ItemCode { get; set; }
        public decimal Cantidad { get; set; }

        public string Manufactura { get; set; }
    }
}
