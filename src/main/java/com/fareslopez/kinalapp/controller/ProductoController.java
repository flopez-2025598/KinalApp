package com.fareslopez.kinalapp.controller;

import com.fareslopez.kinalapp.entity.Producto;
import com.fareslopez.kinalapp.service.IProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private IProductoService productoService;

    @GetMapping
    public List<Producto> listar() {
        return productoService.listarTodos();
    }
    @PostMapping
    public Producto guardar(@RequestBody Producto producto){
        return productoService.guardar(producto);
    }
}