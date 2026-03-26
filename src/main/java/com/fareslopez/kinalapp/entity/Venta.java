package com.fareslopez.kinalapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Ventas")
public class Venta {

    @Id
    @Column(name = "codigo_venta")
    private int codigoVenta;
    @Column
    private LocalDate fechaVenta;
    @Column(precision = 10, scale = 2)
    private BigDecimal total;
    @Column
    private int estado;
    @Column(name = "Clientes_dpi_cliente")
    private int clientesDpiCliente;
    @Column(name = "Usuarios_codigo_usuario")
    private int usuariosCodigoUsuario;

    public Venta(){

    }

    public Venta(int codigoVenta, LocalDate fechaVenta, BigDecimal total, int estado, int clientesDpiCliente, int usuariosCodigoUsuario){
        this.codigoVenta = codigoVenta;
        this.fechaVenta = fechaVenta;
        this.total = total;
        this.estado = estado;
        this.clientesDpiCliente = clientesDpiCliente;
        this.usuariosCodigoUsuario = usuariosCodigoUsuario;
    }

    public int getCodigoVenta() { return codigoVenta; }
    public void setCodigoVenta(int codigoVenta) { this.codigoVenta = codigoVenta; }

    public LocalDate getFechaVenta() { return fechaVenta; }
    public void setFechaVenta(LocalDate fechaVenta) { this.fechaVenta = fechaVenta; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public int getEstado() { return estado; }
    public void setEstado(int estado) { this.estado = estado; }

    public int getClientesDpiCliente() { return clientesDpiCliente; }
    public void setClientesDpiCliente(int clientesDpiCliente) { this.clientesDpiCliente = clientesDpiCliente; }

    public int getUsuariosCodigoUsuario() { return usuariosCodigoUsuario; }
    public void setUsuariosCodigoUsuario(int usuariosCodigoUsuario) { this.usuariosCodigoUsuario = usuariosCodigoUsuario; }
}