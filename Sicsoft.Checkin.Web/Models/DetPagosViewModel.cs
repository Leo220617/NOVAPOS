namespace NOVAAPP.Models
{
    public class DetPagosViewModel
    {
        public int id { get; set; }
        public int idEncabezado { get; set; }
        public int idEncDocumentoCredito { get; set; }
        public int NumLinea { get; set; }
        public decimal Total { get; set; }
        public decimal Interes { get; set; }
        public decimal Capital { get; set; }
    }
}
