// UsuarioRepository.java
package com.fareslopez.kinalapp.repository;

import com.fareslopez.kinalapp.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

}