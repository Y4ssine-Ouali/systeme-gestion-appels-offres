package com.simac.gestion_appels_offres.repositories;

import com.simac.gestion_appels_offres.models.entities.AppelOffre;
import com.simac.gestion_appels_offres.models.entities.Lot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LotRepository extends JpaRepository<Lot, Integer> {
}
