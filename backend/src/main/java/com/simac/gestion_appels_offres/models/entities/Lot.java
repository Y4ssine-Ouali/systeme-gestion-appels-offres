package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.EtatAvancement;
import com.simac.gestion_appels_offres.models.enums.ResultatLot;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Entity
@Setter
@Getter
public class Lot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name="ao_id", nullable=false)
    private AppelOffre appelOffre;

    @Column(nullable = false)
    private Integer numero;

    @Column(nullable = false, length = 500)
    private String objet;

    @Column(precision = 15, scale = 2)
    private BigDecimal budgetEstimatif;

    private EtatAvancement etatAvancement;

    private ResultatLot resultat = ResultatLot.EN_ATTENTE;

    private LocalDate dateResultat;

    @Column(precision = 15, scale = 2)
    private BigDecimal montantAttribue;

    private BigDecimal cautionnementProvisoire;

    @OneToMany(mappedBy = "lot")
    private List<LotMotifEchec> motifsEchec;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;

    @ManyToOne
    @JoinColumn(name = "dossier_id")
    private DossierSoumission dossierSoumission;


}
