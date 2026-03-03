package com.simac.gestion_appels_offres.repositories;


import com.simac.gestion_appels_offres.models.entities.AppelOffre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppelOffreRepository extends JpaRepository<AppelOffre,Integer> {

}
