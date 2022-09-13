namespace NOVAAPP.Models
{
    public class CorreoEnvioViewModel
    {
        public int id { get; set; }

    
        public string RecepcionHostName { get; set; }

        public int EnvioPort { get; set; }

        public bool RecepcionUseSSL { get; set; }

     
        public string RecepcionEmail { get; set; }

       
        public string RecepcionPassword { get; set; }
    }
}
