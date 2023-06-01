namespace NOVAAPP.Models
{
    public class CuentasSAPViewModel
    {
        public cuentas[] Cuentas { get; set; }
    }

    public class cuentas
    {
        public string Cuenta { get; set; }
        public string Nombre { get; set; }
        public string Moneda { get; set; }

    }
}
