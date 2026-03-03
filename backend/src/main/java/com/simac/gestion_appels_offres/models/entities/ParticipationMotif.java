package com.simac.gestion_appels_offres.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ParticipationMotif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_decision", nullable = false)
    private ParticipationDecision decision;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_motif_refus", nullable = false)
    private MotifRefus motifRefus;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    public ParticipationMotif() {}

    public ParticipationMotif(ParticipationDecision decision, MotifRefus motifRefus, String commentaire) {
        this.decision    = decision;
        this.motifRefus  = motifRefus;
        this.commentaire = commentaire;
    }




}
