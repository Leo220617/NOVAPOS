﻿using System;

namespace NOVAAPP.Models
{
    public class OfertasViewModel
    {
        public int id { get; set; }
        public int idCliente { get; set; }
        public int idUsuarioCreador { get; set; }
        public DateTime Fecha { get; set; }
        public DateTime FechaVencimiento { get; set; }
        public string Comentarios { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TotalImpuestos { get; set; }
        public decimal TotalDescuento { get; set; }
        public decimal TotalCompra { get; set; }
        public decimal PorDescto { get; set; }
        public DetOfertaViewModel[] Detalle { get; set; }
    }
}