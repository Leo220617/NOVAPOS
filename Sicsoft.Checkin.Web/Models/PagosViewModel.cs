﻿using NOVAPOS.Models;
using System;

namespace NOVAAPP.Models
{
    public class PagosViewModel
    {
        public int id { get; set; }
        public int idCliente { get; set; }
        public string CodSuc { get; set; }
        public DateTime Fecha { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public DateTime FechaContabilizacion { get; set; }
        public string Comentarios { get; set; }
        public string Referencia { get; set; }
        public string Moneda { get; set; }
        public decimal TotalPagado { get; set; }
        public bool ProcesadaSAP { get; set; }
        public string DocEntryPago { get; set; }
        public decimal TotalInteres { get; set; }
        public decimal TotalCapital { get; set; }

        public bool IntProcesadaSAP { get; set; }

        public string DocEntryInt { get; set; }
        public int idCaja { get; set; }
        public int idUsuarioCreador { get; set; }

        public DetPagosViewModel[] Detalle { get; set; }

        public MetodosPagosAbonosViewModel[] MetodosPagosAbonos { get; set; }

    }
}
