package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Venta;
import com.fareslopez.kinalapp.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VentaService implements IVentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Override
    public List<Venta> listarTodos(){
        return ventaRepository.findAll();
    }

    @Override
    public Venta guardar(Venta venta){
        return ventaRepository.save(venta);
    }

    @Override
    public Optional<Venta> buscarPorId(int id){
        return ventaRepository.findById(id);
    }

    @Override
    public Venta actualizar(int id, Venta venta){
        venta.setCodigoVenta(id);
        return ventaRepository.save(venta);
    }

    @Override
    public void eliminar(int id){
        ventaRepository.deleteById(id);
    }

    @Override
    public boolean existePorId(int id){
        return ventaRepository.existsById(id);
    }
}