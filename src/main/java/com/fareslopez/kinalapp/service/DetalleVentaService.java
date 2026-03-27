package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.DetalleVenta;
import com.fareslopez.kinalapp.repository.DetalleVentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleVentaService {

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    public List<DetalleVenta> getAll(){
        return detalleVentaRepository.findAll();
    }

    public DetalleVenta getById(int id){
        return detalleVentaRepository.findById(id).orElse(null);
    }

    public DetalleVenta save(DetalleVenta detalleVenta){
        return detalleVentaRepository.save(detalleVenta);
    }

    public void delete(int id){
        detalleVentaRepository.deleteById(id);
    }
}