package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.StatusValidationDossier;
import com.simac.gestion_appels_offres.models.enums.TypeValidation;
import jakarta.persistence.*;

import java.time.LocalDateTime;

public class ValidationDossier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_dossier", nullable = false)
    private DossierSoumission dossierSoumission;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusValidationDossier statusValidationDossier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "validateur_id", nullable = false)
    private Utilisateur validateur;

    private String commentaire;

    private LocalDateTime dateValidation;

    private LocalDateTime dateLimiteValidation;









}
