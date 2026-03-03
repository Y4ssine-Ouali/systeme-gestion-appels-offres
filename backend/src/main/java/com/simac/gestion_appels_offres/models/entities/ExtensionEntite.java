package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.TypeAttribut;
import com.simac.gestion_appels_offres.models.enums.TypeEntite;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ExtensionEntite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private TypeEntite typeEntite;

    private Long entityId;

    private String key;

    private String value;

    private TypeAttribut typeAttribut;


}
