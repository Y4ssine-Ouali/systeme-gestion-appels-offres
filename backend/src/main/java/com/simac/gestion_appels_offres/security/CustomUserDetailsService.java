package com.simac.gestion_appels_offres.security;

import com.simac.gestion_appels_offres.models.entities.Utilisateur;
import com.simac.gestion_appels_offres.repositories.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur user = utilisateurRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(email));

        List<GrantedAuthority> grantedAuthorities = user.getRoles()
                .stream()
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getNom()))
                .collect(Collectors.toList());

        return new org.springframework.security
                .core.userdetails.User(
                        user.getEmail(),
                        user.getPassword(),
                        grantedAuthorities
        );

    }


}
