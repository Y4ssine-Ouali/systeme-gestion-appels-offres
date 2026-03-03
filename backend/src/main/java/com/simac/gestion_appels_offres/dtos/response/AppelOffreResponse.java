package com.simac.gestion_appels_offres.dtos.response;

import com.simac.gestion_appels_offres.models.enums.NatureMarche;
import com.simac.gestion_appels_offres.models.enums.TypeAppelOffre;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AppelOffreResponse {

    private String reference;

    private TypeAppelOffre type;

    private String objet;

    private LocalDate dateLancement;

    private LocalDate dateLimite;

    private NatureMarche natureMarche;

    private BigDecimal budgetEstimatif;

    private Integer clientID;

}
