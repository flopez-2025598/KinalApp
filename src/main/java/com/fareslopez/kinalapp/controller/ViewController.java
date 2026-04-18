package com.fareslopez.kinalapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    /* ---- RUTA RAÍZ → redirige al login ---- */
    @GetMapping("/")
    public String raiz() {
        return "redirect:/login-view";
    }

    /* ---- LOGIN ---- */
    @GetMapping("/login-view")
    public String login() {
        return "login";
    }

    /* ---- MÓDULOS ---- */
    @GetMapping("/clientes-view")
    public String clientes() {
        return "clientes";
    }

    @GetMapping("/usuarios-view")
    public String usuarios() {
        return "usuarios";
    }

    @GetMapping("/productos-view")
    public String productos() {
        return "productos";
    }

    @GetMapping("/ventas-view")
    public String ventas() {
        return "ventas";
    }

    @GetMapping("/detalleventa-view")
    public String detalleVenta() {
        return "detalleventa";
    }
}