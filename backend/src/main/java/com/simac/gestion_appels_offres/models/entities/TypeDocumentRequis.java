package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.CategorieDocument;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TypeDocumentRequis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(name = "categorie", nullable = false)
    private CategorieDocument categorie;

    private boolean estEliminatoireParDefaut = false;

    @OneToOne(mappedBy = "typeDocument", fetch = FetchType.LAZY)
    private DocumentEntreprise documentEntreprise;


}
