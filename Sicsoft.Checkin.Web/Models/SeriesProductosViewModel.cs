namespace NOVAAPP.Models
{
    public class SeriesProductosViewModel
    {
        public SeriesProductos[] SeriesProductos { get; set; }
    }

    public class SeriesProductos
    {
        public string CodProducto { get; set; }

        public string CodBodega { get; set; }

        public string Series { get; set; }

        public decimal Cantidad { get; set; }

        public string Manufactura { get; set; }

    }
}