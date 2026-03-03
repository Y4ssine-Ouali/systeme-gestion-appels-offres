package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.ContratStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Contrat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    private LocalTime dateSignature;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal montant;

    @ManyToOne(optional = false)
    @JoinColumn(name="responsable_suivi_id", nullable = false)
    private Utilisateur responsableSuivi;

    @Enumerated(EnumType.STRING)
    private ContratStatus contratStatus = ContratStatus.NON_ACTIF;

    @OneToMany(mappedBy = "contrat", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<EngagementContractuel> engagementContractuels;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;


}
