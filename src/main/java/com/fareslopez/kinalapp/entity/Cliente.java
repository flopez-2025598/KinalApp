package com.fareslopez.kinalapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Clientes")
public class Cliente {

    @Id
    @Column(name = "dpi_cliente")
    private int dpiCliente;
    @Column(name = "nombre_cliente")
    private String nombreCliente;
    @Column(name = "apellido_cliente")
    private String apellidoCliente;
    @Column
    private String direccion;
    @Column
    private int estado;

    public Cliente(){

    }

    public Cliente(int dpiCliente, String nombreCliente, String apellidoCliente, String direccion, int estado) {
        this.dpiCliente = dpiCliente;
        this.nombreCliente = nombreCliente;
        this.apellidoCliente = apellidoCliente;
        this.direccion = direccion;
        this.estado = estado;
    }

    public int getDpiCliente() { return dpiCliente; }
    public void setDpiCliente(int dpiCliente) { this.dpiCliente = dpiCliente; }

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }

    public String getApellidoCliente() { return apellidoCliente; }
    public void setApellidoCliente(String apellidoCliente) { this.apellidoCliente = apellidoCliente; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public int getEstado() { return estado; }
    public void setEstado(int estado) { this.estado = estado; }
}