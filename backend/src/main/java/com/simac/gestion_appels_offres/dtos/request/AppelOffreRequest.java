package com.simac.gestion_appels_offres.dtos.request;

import com.simac.gestion_appels_offres.models.enums.NatureMarche;
import com.simac.gestion_appels_offres.models.enums.TypeAppelOffre;
import jakarta.validation.constraints.*;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
public class AppelOffreRequest {

    @NotBlank
    @Size(max = 20)
    private String reference;

    private TypeAppelOffre type;

    @NotBlank
    @Size(max = 500)
    private String objet;

    @NotNull
    @FutureOrPresent
    private LocalDate dateLancement;

    @NotNull
    @Future
    private LocalDate dateLimite;

    @NotNull
    private NatureMarche natureMarche;

    @DecimalMin("0.00")
    private BigDecimal budgetEstimatif;

    @NotNull
    private Integer clientID;


}
