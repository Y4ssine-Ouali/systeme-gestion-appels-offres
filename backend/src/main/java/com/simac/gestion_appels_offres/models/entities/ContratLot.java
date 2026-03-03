package com.simac.gestion_appels_offres.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
public class ContratLot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_contrat", nullable = false)
    private Contrat contrat;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_lot", nullable = false)
    private Lot lot;

    @Column(precision = 15, scale = 2)
    private BigDecimal montantLot;


}
