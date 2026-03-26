package com.fareslopez.kinalapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "Productos")
public class Producto {
    @Id
    @Column(name = "codigo_Producto")
    private int codigoProducto;
    @Column
    private String Nombreproducto;
    @Column(precision = 10, scale = 2)
    private BigDecimal precio;
    @Column
    private int Stock;
    @Column
    private int Estado;

    public Producto(){

    }
    public Producto(int CodigoProducto, String Nombreproducto, BigDecimal precio, int Stock, int Estado ){
        this.codigoProducto = CodigoProducto;
        this.Nombreproducto = Nombreproducto;
        this.precio = precio;
        this.Stock = Stock;
        this.Estado = Estado;

    }

    public int getCodigoProducto() {
        return codigoProducto;
    }

    public void setCodigoProducto(int codigoProducto) {
        codigoProducto = codigoProducto;
    }

    public String getNombreproducto() {
        return Nombreproducto;
    }

    public void setNombreproducto(String nombreproducto) {
        Nombreproducto = nombreproducto;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public int getStock() {
        return Stock;
    }

    public void setStock(int stock) {
        Stock = stock;
    }

    public int getEstado() {
        return Estado;
    }

    public void setEstado(int estado) {
        Estado = estado;
    }
}
