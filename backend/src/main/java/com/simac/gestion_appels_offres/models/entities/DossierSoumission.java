package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.StatusValidation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class DossierSoumission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate dateSoumission;

    @CreationTimestamp
    private Instant createdAt;

    private LocalDate dateDerniereRelance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusValidation statusValidation;

    @OneToMany(mappedBy = "dossierSoumission")
    private List<Lot> lots;




}
