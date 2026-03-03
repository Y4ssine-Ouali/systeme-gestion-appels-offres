package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.dtos.response.AppelOffreResponse;
import com.simac.gestion_appels_offres.models.enums.ModePassation;
import com.simac.gestion_appels_offres.models.enums.TypeAppelOffre;
import com.simac.gestion_appels_offres.models.enums.NatureMarche;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class AppelOffre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 20, nullable = false, unique = true)
    private String reference;

    @Enumerated(EnumType.STRING)
    @Column(name="type", nullable = false)
    private TypeAppelOffre appelOffreType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModePassation  modePassation;

    @Column(length=500, nullable = false)
    private String objet;

    @Column(nullable = false)
    private LocalDate dateOuverture;

    @Column(nullable = false)
    private LocalDate dateLimiteDepot;

    @Column(nullable = false)
    private String adresseReception;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NatureMarche  natureMarche;

    @Column(precision = 15, scale = 2)
    private BigDecimal budgetEstimatif;

    @ManyToOne(optional = false)
    @JoinColumn(name="responsable_id", nullable = false)
    private Utilisateur responsable;

    private boolean possibiliteGroupement;

    @ManyToOne(optional = false)
    @JoinColumn(name="client_id", nullable = false)
    private Client client;

    @OneToMany(mappedBy = "appelOffre", fetch = FetchType.EAGER)
    private List<Lot> lots;

    @CreationTimestamp
    private Instant createdAt;



}
