package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.DetalleVenta;
import com.fareslopez.kinalapp.repository.DetalleVentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleVentaService implements IDetalleVentaService {

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Override
    public List<DetalleVenta> listarTodos(){
        return detalleVentaRepository.findAll();
    }

    @Override
    public DetalleVenta guardar(DetalleVenta detalleVenta){
        return detalleVentaRepository.save(detalleVenta);
    }

    @Override
    public Optional<DetalleVenta> buscarPorId(int id){
        return detalleVentaRepository.findById(id);
    }

    @Override
    public DetalleVenta actualizar(int id, DetalleVenta detalleVenta){
        detalleVenta.setCodigoDetalleVenta(id);
        return detalleVentaRepository.save(detalleVenta);
    }

    @Override
    public void eliminar(int id){
        detalleVentaRepository.deleteById(id);
    }

    @Override
    public boolean existePorId(int id){
        return detalleVentaRepository.existsById(id);
    }
}