package com.simac.gestion_appels_offres.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class LotMotifEchec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_lot", nullable = false)
    private Lot lot;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_motif_refus", nullable = false)
    private MotifRefus motifRefus;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    public LotMotifEchec() {}

    public LotMotifEchec(Lot lot, MotifRefus motifRefus, String commentaire) {
        this.lot         = lot;
        this.motifRefus  = motifRefus;
        this.commentaire = commentaire;
    }


}
