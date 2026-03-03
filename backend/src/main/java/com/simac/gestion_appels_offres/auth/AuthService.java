package com.simac.gestion_appels_offres.auth;

import com.simac.gestion_appels_offres.dtos.request.LoginRequest;
import com.simac.gestion_appels_offres.dtos.response.AuthResponse;
import com.simac.gestion_appels_offres.models.entities.RefreshToken;
import com.simac.gestion_appels_offres.models.entities.Utilisateur;
import com.simac.gestion_appels_offres.repositories.RefreshTokenRepository;
import com.simac.gestion_appels_offres.repositories.UtilisateurRepository;
import com.simac.gestion_appels_offres.security.CustomUserDetailsService;
import com.simac.gestion_appels_offres.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final UtilisateurRepository utilisateurRepository;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(), loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        String email = userDetails.getUsername();
        Utilisateur utilisateur = utilisateurRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(email));

        refreshTokenRepository.deleteByUser(utilisateur);

        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setToken(refreshToken);
        refreshTokenEntity.setUser(utilisateur);
        refreshTokenEntity.setExpiryDate(jwtService.createRefreshTokenExpiry());
        refreshTokenRepository.save(refreshTokenEntity);

        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse refreshToken(String requestRefreshToken) {

        RefreshToken refreshTokenEntity = refreshTokenRepository
                .findByToken(requestRefreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (refreshTokenEntity.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshTokenEntity);
            throw new RuntimeException("Refresh token expired");
        }

        Utilisateur user = refreshTokenEntity.getUser();
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());

        String accessToken = jwtService.generateToken(userDetails);

        return new AuthResponse(accessToken, requestRefreshToken);
    }

    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(refreshTokenRepository::delete);
    }
}
