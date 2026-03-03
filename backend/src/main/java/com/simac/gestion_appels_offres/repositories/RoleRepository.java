package com.simac.gestion_appels_offres.repositories;

import com.simac.gestion_appels_offres.models.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}
