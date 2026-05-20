package com.fareslopez.kinalapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "DetalleVenta")
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigo_detalle_venta")
    private int codigoDetalleVenta;
    @Column
    private int cantidad;
    @Column(precision = 10, scale = 2)
    private BigDecimal precioUnitario;
    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;
    @Column(name = "Productos_codigo_producto")
    private int productoCodigoProducto;
    @Column(name = "Ventas_codigo_venta")
    private int ventasCodigoVenta;

    public DetalleVenta(){

    }

    public DetalleVenta(int codigoDetalleVenta, int cantidad, BigDecimal precioUnitario, BigDecimal subtotal, int productoCodigoProducto, int ventasCodigoVenta){
        this.codigoDetalleVenta = codigoDetalleVenta;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
        this.productoCodigoProducto = productoCodigoProducto;
        this.ventasCodigoVenta = ventasCodigoVenta;
    }

    public int getCodigoDetalleVenta() { return codigoDetalleVenta; }
    public void setCodigoDetalleVenta(int codigoDetalleVenta) { this.codigoDetalleVenta = codigoDetalleVenta; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public int getProductoCodigoProducto() { return productoCodigoProducto; }
    public void setProductoCodigoProducto(int productoCodigoProducto) { this.productoCodigoProducto = productoCodigoProducto; }

    public int getVentasCodigoVenta() { return ventasCodigoVenta; }
    public void setVentasCodigoVenta(int ventasCodigoVenta) { this.ventasCodigoVenta = ventasCodigoVenta; }
}