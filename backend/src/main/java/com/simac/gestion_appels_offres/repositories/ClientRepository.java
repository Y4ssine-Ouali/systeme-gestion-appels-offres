package com.simac.gestion_appels_offres.repositories;

import com.simac.gestion_appels_offres.models.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client,Integer> {
}
