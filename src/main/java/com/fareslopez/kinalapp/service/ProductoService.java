package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Producto;
import com.fareslopez.kinalapp.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService implements IProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public List<Producto> listarTodos(){
        return productoRepository.findAll();
    }

    @Override
    public Producto guardar(Producto producto){
        return productoRepository.save(producto);
    }

    @Override
    public Optional<Producto> buscarPorId(int id){
        return productoRepository.findById(id);
    }

    @Override
    public Producto actualizar(int id, Producto producto){
        producto.setCodigoProducto(id);
        return productoRepository.save(producto);
    }

    @Override
    public void eliminar(int id){
        productoRepository.deleteById(id);
    }

    @Override
    public boolean existePorId(int id){
        return productoRepository.existsById(id);
    }
}