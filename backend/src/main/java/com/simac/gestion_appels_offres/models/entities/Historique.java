package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.TypeAction;
import com.simac.gestion_appels_offres.models.enums.TypeEntite;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Historique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private TypeEntite typeEntite;

    private Long entiteId;

    private TypeAction actionType;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateAction;

    @Column(columnDefinition = "TEXT")
    private String description;






}
