using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using NOVAAPP.Models;
using Sicsoft.Checkin.Web.Servicios;
using Sicsoft.CostaRica.Checkin.Web.Models;

namespace NOVAAPP.Pages.Ofertas
{
    public class IndexModel : PageModel
    {
        private readonly ICrudApi<OfertasViewModel, int> service;




        public IndexModel(ICrudApi<OfertasViewModel, int> service)
        {
            this.service = service;
        }

        public void OnGet()
        {

        }
    }
}
