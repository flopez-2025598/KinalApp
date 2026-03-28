package com.fareslopez.kinalapp.controller;

import com.fareslopez.kinalapp.entity.Venta;
import com.fareslopez.kinalapp.service.IVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ventas")
public class VentaController {

    @Autowired
    private IVentaService ventaService;

    @GetMapping
    public List<Venta> listar() {
        return ventaService.listarTodos();
    }
    @PostMapping
    public Venta guardar(@RequestBody Venta venta){
        return ventaService.guardar(venta);
    }
}