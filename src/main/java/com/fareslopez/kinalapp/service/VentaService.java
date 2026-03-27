package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Venta;
import com.fareslopez.kinalapp.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    public List<Venta> getAll(){
        return ventaRepository.findAll();
    }

    public Venta getById(int id){
        return ventaRepository.findById(id).orElse(null);
    }

    public Venta save(Venta venta){
        return ventaRepository.save(venta);
    }

    public void delete(int id){
        ventaRepository.deleteById(id);
    }
}