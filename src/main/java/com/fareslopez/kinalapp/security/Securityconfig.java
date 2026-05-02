package com.fareslopez.kinalapp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    /* ── Encoder de contraseñas ──────────────────────────────────
       NoOpPasswordEncoder = texto plano (sin hash).
       Las contraseñas en tu BD están en texto plano.
       Para producción real, cambiar a BCryptPasswordEncoder
       y migrar las contraseñas de la BD.
    ────────────────────────────────────────────────────────────── */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    /* ── Proveedor de autenticación ─────────────────────────────── */
    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /* ── AuthenticationManager ──────────────────────────────────── */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /* ══════════════════════════════════════════════════════════════
       CADENA DE FILTROS DE SEGURIDAD
       Define qué rutas son públicas y cuáles requieren rol
    ══════════════════════════════════════════════════════════════ */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .authenticationProvider(authProvider())

                /* ── Reglas de autorización por ruta ── */
                .authorizeHttpRequests(auth -> auth

                        /* Recursos estáticos y login: PÚBLICOS */
                        .requestMatchers(
                                "/login-view",
                                "/login",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/fonts/**"
                        ).permitAll()

                        /* Registro de usuarios: solo ADMIN puede crear */
                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST, "/usuarios"
                        ).hasRole("ADMIN")

                        /* API de usuarios: solo ADMIN */
                        .requestMatchers("/usuarios/**").hasRole("ADMIN")

                        /* Módulo Productos: ADMIN y BODEGUERO */
                        .requestMatchers("/productos-view", "/productos/**")
                        .hasAnyRole("ADMIN", "BODEGUERO")

                        /* Módulo Clientes: ADMIN y VENDEDOR */
                        .requestMatchers("/clientes-view", "/clientes/**")
                        .hasAnyRole("ADMIN", "VENDEDOR")

                        /* Módulo Ventas: ADMIN y VENDEDOR */
                        .requestMatchers("/ventas-view", "/ventas/**")
                        .hasAnyRole("ADMIN", "VENDEDOR")

                        /* Módulo Detalle Ventas: ADMIN y VENDEDOR */
                        .requestMatchers("/detalleventa-view", "/detalleventas/**")
                        .hasAnyRole("ADMIN", "VENDEDOR")

                        /* Módulo Usuarios (vista): solo ADMIN */
                        .requestMatchers("/usuarios-view")
                        .hasRole("ADMIN")

                        /* Cualquier otra ruta: requiere autenticación */
                        .anyRequest().authenticated()
                )

                /* ── Configuración del formulario de login ── */
                .formLogin(form -> form
                        .loginPage("/login-view")           // Tu página de login personalizada
                        .loginProcessingUrl("/login")        // Spring Security procesa aquí el POST
                        .usernameParameter("username")       // nombre del input en el HTML
                        .passwordParameter("password")       // nombre del input en el HTML
                        .defaultSuccessUrl("/clientes-view", true) // redirige tras login exitoso
                        .failureUrl("/login-view?error=true") // redirige si credenciales incorrectas
                        .permitAll()
                )

                /* ── Configuración del logout ── */
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                        .logoutSuccessUrl("/login-view?logout=true")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .permitAll()
                )

                /* ── Acceso denegado → página de error 403 ── */
                .exceptionHandling(ex -> ex
                        .accessDeniedPage("/acceso-denegado")
                )

                /* ── Deshabilitar CSRF solo para las APIs REST ──
                   Necesario porque los fetch() del JS no envían token CSRF.
                   Las vistas Thymeleaf sí están protegidas. */
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(
                                "/clientes/**",
                                "/productos/**",
                                "/usuarios/**",
                                "/ventas/**",
                                "/detalleventas/**"
                        )
                );

        return http.build();
    }
}