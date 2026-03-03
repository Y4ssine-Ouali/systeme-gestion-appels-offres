package com.simac.gestion_appels_offres.models.entities;

import com.simac.gestion_appels_offres.models.enums.StatusNotification;
import com.simac.gestion_appels_offres.models.enums.TypeEntite;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="id_type_notification")
    private TypeNotification typeNotification;

    @ManyToOne(optional = false)
    @JoinColumn(name="destinataire_id", nullable=false)
    private Utilisateur destinataire;

    @Column(nullable=false, length=500)
    private String sujet;

    @Column(nullable=false, columnDefinition = "TEXT")
    private String message;

    private StatusNotification status = StatusNotification.EN_ATTENTE;

    @Column(nullable=false)
    private LocalDateTime dateCreation;

    private LocalDateTime dateEnvoi;

    private TypeEntite typeEntite;

    private Long entiteId;

    private boolean lu = false;









}
