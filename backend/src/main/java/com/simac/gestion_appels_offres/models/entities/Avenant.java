package com.simac.gestion_appels_offres.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Avenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_contrat", nullable = false)
    private Contrat contrat;

    private LocalDateTime dateSignature;

    private LocalTime dateEffet;

    @OneToMany(mappedBy = "avenant")
    private List<DocumentContrat> documents;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;






}
