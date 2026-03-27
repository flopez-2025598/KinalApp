// ProductoService.java
package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Producto;
import com.fareslopez.kinalapp.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> getAll(){
        return productoRepository.findAll();
    }

    public Producto getById(int id){
        return productoRepository.findById(id).orElse(null);
    }

    public Producto save(Producto producto){
        return productoRepository.save(producto);
    }

    public void delete(int id){
        productoRepository.deleteById(id);
    }
}