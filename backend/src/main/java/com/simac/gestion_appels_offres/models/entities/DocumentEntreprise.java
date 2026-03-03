package com.simac.gestion_appels_offres.models.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
public class DocumentEntreprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(optional = false)
    @JoinColumn(name="id_type_document", nullable = false)
    private TypeDocumentRequis typeDocument;

    @ManyToOne
    @JoinColumn(name="id_fichier_courant")
    private FichierPhysique fichierCourant;

    private String libelle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mis_a_jour_par")
    private Utilisateur misAJourPar;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;





}
