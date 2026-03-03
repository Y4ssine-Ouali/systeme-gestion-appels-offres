package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.StatusEngagement;
import com.simac.gestion_appels_offres.models.enums.TypeEngagement;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class EngagementContractuel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Contrat contrat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeEngagement  typeEngagement;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEngagement status;

    private LocalDate dateEcheance;

    private LocalDate dateRealisation;


}
