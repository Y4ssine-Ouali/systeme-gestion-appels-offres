package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.StatusEcheance;
import com.simac.gestion_appels_offres.models.enums.TypeEcheance;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Echeance {
    
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_contrat", nullable = false)
    private Contrat contrat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeEcheance typeEcheance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEcheance statusEcheance;

    private LocalDate dateEcheance;

    @Column(nullable = false)
    private int jourAlerteAvant;

    @Column(nullable = false)
    private boolean alerteEnvoye = false;
    
    private Instant dateAlerteEnvoye;


    
    
}
