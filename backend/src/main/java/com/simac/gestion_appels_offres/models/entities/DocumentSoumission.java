package com.simac.gestion_appels_offres.models.entities;

import jakarta.persistence.*;

@Entity
public class DocumentSoumission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_dossier", nullable = false)
    private DossierSoumission dossierSoumission;

    @Column(nullable = false)
    private boolean estEliminatoire;

    @Column(nullable = false)
    private boolean estDemande;

    @Column(nullable = false)
    private boolean estFourni;



}
