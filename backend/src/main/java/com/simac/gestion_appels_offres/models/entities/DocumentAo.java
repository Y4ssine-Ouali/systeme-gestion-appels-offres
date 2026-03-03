package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.TypeDocumentAo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class DocumentAo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_ao", nullable = false)
    private AppelOffre appelOffre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeDocumentAo  typeDocumentAo;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, length=500)
    private String path;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="uploaded_by")
    private Utilisateur uploadedBy;

    private LocalDateTime dateUpload;


}
