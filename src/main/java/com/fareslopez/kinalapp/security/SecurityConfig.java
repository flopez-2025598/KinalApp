package com.fareslopez.kinalapp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final ManejadorDeAutenticacion manejadorDeAutenticacion;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService,
                          ManejadorDeAutenticacion manejadorDeAutenticacion) {
        this.userDetailsService = userDetailsService;
        this.manejadorDeAutenticacion = manejadorDeAutenticacion;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
                // Usar BCrypt en ambiente de pruebas/producción; las contraseñas en BD deben ser hashes BCrypt
                return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .authenticationProvider(authProvider())
                .authorizeHttpRequests(auth -> auth

                        // ── Rutas públicas (sin sesión) ──────────────────────────
                        .requestMatchers(
                                "/login-view", "/login", "/acceso-denegado",
                                "/css/**", "/js/**", "/images/**", "/fonts/**", "/webjars/**"
                        ).permitAll()

                        // ── Administración de usuarios ───────────────────────────
                        .requestMatchers("/usuarios-view").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,    "/usuarios", "/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,   "/usuarios").permitAll()
                        .requestMatchers(HttpMethod.PUT,    "/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/usuarios/**").hasRole("ADMIN")

                        // ── Recursos generales: listar, buscar y agregar para USER/Admin ──
                        .requestMatchers("/productos-view").hasAnyRole("ADMIN","VENDEDOR","CLIENTE")

                        .requestMatchers("/clientes-view", "/ventas-view", "/detalleventa-view")
                        .hasAnyRole("ADMIN", "VENDEDOR")

                        .requestMatchers(HttpMethod.GET,
                                "/productos", "/productos/**"
                        ).hasAnyRole("ADMIN", "VENDEDOR", "CLIENTE")

                        .requestMatchers(HttpMethod.GET,
                                "/clientes", "/clientes/**",
                                "/ventas", "/ventas/**",
                                "/detalleventas", "/detalleventas/**"
                        ).hasAnyRole("ADMIN", "VENDEDOR")

                        .requestMatchers(HttpMethod.POST,
                                "/productos"
                        ).hasAnyRole("ADMIN", "VENDEDOR")

                        .requestMatchers(HttpMethod.POST,
                                "/clientes", "/ventas", "/detalleventas"
                        ).hasAnyRole("ADMIN", "VENDEDOR")

                        .requestMatchers(HttpMethod.PUT,
                                "/clientes/**", "/productos/**",
                                "/ventas/**", "/detalleventas/**"
                        ).hasAnyRole("ADMIN", "VENDEDOR")

                        .requestMatchers(HttpMethod.DELETE,
                                "/clientes/**", "/productos/**",
                                "/ventas/**", "/detalleventas/**"
                        ).hasAnyRole("ADMIN", "VENDEDOR")

                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login-view")
                        .loginProcessingUrl("/login")
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .successHandler(manejadorDeAutenticacion)
                        .failureUrl("/login-view?error=true")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login-view?logout=true")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .permitAll()
                )
                .exceptionHandling(ex -> ex
                        .accessDeniedPage("/acceso-denegado")
                )
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(
                                "/logout",
                                "/clientes/**", "/productos/**",
                                "/usuarios/**", "/ventas/**", "/detalleventas/**"
                        )
                );

        return http.build();
    }
}