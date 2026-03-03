package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.DecisionParticipation;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
public class ParticipationDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DecisionParticipation decision;

    @ManyToOne(optional = false)
    @JoinColumn(name="lot_id", nullable = false)
    private Lot lot;

    @Column(nullable = false)
    private LocalDate dateDecision;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String justificationText;

    @ManyToOne(optional = false)
    @JoinColumn(name="decideur_id", nullable = false)
    private Utilisateur decideur;

    @OneToMany(mappedBy = "decision")
    private List<ParticipationMotif> participationMotifs;


}
