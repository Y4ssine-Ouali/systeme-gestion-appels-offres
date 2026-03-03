package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.CategorieMotif;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class MotifRefus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String libelle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategorieMotif categorie;



}
