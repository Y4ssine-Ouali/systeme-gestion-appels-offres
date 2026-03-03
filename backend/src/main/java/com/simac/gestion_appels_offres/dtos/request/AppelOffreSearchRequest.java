package com.simac.gestion_appels_offres.dtos.request;

import com.simac.gestion_appels_offres.models.enums.NatureMarche;
import com.simac.gestion_appels_offres.models.enums.TypeAppelOffre;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class AppelOffreSearchRequest {
    private String reference;
    private TypeAppelOffre type;
    private NatureMarche natureMarche;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dateLimiteFrom;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dateLimiteTo;
}
