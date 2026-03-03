package com.simac.gestion_appels_offres.repositories;

import com.simac.gestion_appels_offres.models.entities.RefreshToken;
import com.simac.gestion_appels_offres.models.entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(Utilisateur user);
}
