package com.fareslopez.kinalapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Usuarios")
public class Usuario {

    @Id
    @Column(name = "codigo_usuario")
    private int codigoUsuario;
    @Column(name = "username")
    private String usuario;
    @Column(name = "password")
    private String contrasena;
    @Column(name = "email")
    private String correo;
    @Column(name = "rol")
    private String rol;
    @Column(name = "estado")
    private int estado;

    public Usuario() {

    }

    public Usuario(int codigoUsuario, String usuario, String contrasena, String correo, String rol, int estado) {
        this.codigoUsuario = codigoUsuario;
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.correo = correo;
        this.rol = rol;
        this.estado = estado;
    }

    public int getCodigoUsuario() { return codigoUsuario; }
    public void setCodigoUsuario(int codigoUsuario) { this.codigoUsuario = codigoUsuario; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public int getEstado() { return estado; }
    public void setEstado(int estado) { this.estado = estado; }
}