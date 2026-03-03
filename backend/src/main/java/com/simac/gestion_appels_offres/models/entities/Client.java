package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.TypeSecteur;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;


@Entity
@Getter
@Setter
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String client;

    private String adresse;

    @Column(unique = true)
    private String email;

    @Column(length=20)
    private String telephone;

    @Enumerated(EnumType.STRING)
    private TypeSecteur secteur;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;

}
