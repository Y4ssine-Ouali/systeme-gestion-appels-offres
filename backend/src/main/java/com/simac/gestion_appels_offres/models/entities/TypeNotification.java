package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.CanalNotification;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TypeNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String libelle;

    private String description;

    private String templateSujet;

    private String templateCorps;

    private CanalNotification canalDefaut;







}
