package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.TypeDocumentContrat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
public class DocumentContrat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false, updatable = false)
    private Contrat contrat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_avenant")
    private Avenant avenant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeDocumentContrat type;

    @Column(nullable = false)
    private String nom;

    private String path;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private Utilisateur uploadedBy;

    @Column(nullable = false)
    private LocalDateTime dateUpload;


}
