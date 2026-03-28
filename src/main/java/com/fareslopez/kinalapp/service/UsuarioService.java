package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Usuario;
import com.fareslopez.kinalapp.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements IUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<Usuario> listarTodos(){
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario guardar(Usuario usuario){
        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorId(int id){
        return usuarioRepository.findById(id);
    }

    @Override
    public Usuario actualizar(int id, Usuario usuario){
        usuario.setCodigoUsuario(id);
        return usuarioRepository.save(usuario);
    }

    @Override
    public void eliminar(int id){
        usuarioRepository.deleteById(id);
    }

    @Override
    public boolean existePorId(int id){
        return usuarioRepository.existsById(id);
    }
}