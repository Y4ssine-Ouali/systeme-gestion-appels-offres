// ─── Enums ───
export type AppelOffreType = 'NATIONAL' | 'INTERNATIONAL';
export type ModePassation = 'OUVERT' | 'RESTREINT' | 'CONSULTATION';
export type NatureMarche = 'PUBLIC' | 'PRIVE';
export type EtatGlobal = 'BROUILLON' | 'PUBLIE' | 'EN_COURS' | 'CLOTURE' | 'ANNULE' | 'ATTRIBUE';
export type TypeDocumentAo =
  | 'CAHIER_DES_CHARGES'
  | 'REGLEMENT_DE_CONSULTATION'
  | 'ANNEXE'
  | 'MODELE_DE_SOUMISSION'
  | 'AVIS'
  | 'AUTRE';
export type TypeSecteur = 'PUBLIC' | 'PRIVE';
export type TypeEntite = 'APPEL_OFFRE' | 'LOT' | 'SOUMISSION' | 'CONTRAT' | 'DECISION';
export type TypeAction = 'CREATION' | 'MODIFICATION' | 'SUPPRESSION' | 'CHANGEMENT_ETAT';
export type DecisionParticipation = 'GO' | 'NO_GO';
export type StatutValidation = 'SOUMISE' | 'VALIDEE' | 'REJETEE';
export type CategorieMotif =
  | 'TECHNIQUE'
  | 'FINANCIER'
  | 'ADMINISTRATIF'
  | 'JURIDIQUE'
  | 'CAPACITE_INTERNE'
  | 'AUTRE';

// ─── Requests ───
export interface LotRequest {
  numero: number;
  objet: string;
  budgetEstimatif: number;
  cautionnementProvisoire: number;
}

export interface AttributDynamiqueRequest {
  key: string;
  value: string;
}

export interface AppelOffreRequest {
  reference: string;
  appelOffreType: AppelOffreType;
  modePassation: ModePassation;
  natureMarche: NatureMarche;
  objet: string;
  dateOuverture: string;
  dateLimiteDepot: string;
  adresseReception: string;
  budgetEstimatif?: number | null;
  currencyCode?: string;
  responsableId?: number | null;
  clientId: number;
  possibiliteGroupement: boolean;
  lots: LotRequest[];
  attributsDynamiques: AttributDynamiqueRequest[];
}

export interface AppelOffreUpdateRequest {
  objet?: string;
  dateOuverture?: string;
  dateLimiteDepot?: string;
  adresseReception?: string;
  budgetEstimatif?: number;
  currencyCode?: string;
  clientId?: number;
  possibiliteGroupement?: boolean;
  propagerVersLots: boolean;
  attributsDynamiques: AttributDynamiqueRequest[];
}

// ─── Decision requests ───
export interface MotifRefusItem {
  motifRefusId: number;
  commentaire?: string;
}

export interface ParticipationDecisionRequest {
  decision: DecisionParticipation;
  dateDecision: string;
  justificationText: string;
  decideurId: number;
  lotIds: number[];
  motifs?: MotifRefusItem[];
}

export interface ValidationDecisionRequest {
  statut: 'VALIDEE' | 'REJETEE';
  validateurId: number;
  dateValidation: string;
  commentaireValidation?: string;
}

// ─── Decision responses ───
export interface MotifRefusResponse {
  id: number;
  libelle: string;
  categorie: CategorieMotif;
  commentaire?: string;
}

export interface MotifRefusReference {
  id: number;
  libelle: string;
  categorie: CategorieMotif;
}

export interface DecisionSummaryResponse {
  id: number;
  groupeId: string;
  decision: DecisionParticipation;
  dateDecision: string;
  justificationText: string;
  decideurNom: string;
  statutValidation: StatutValidation;
  validateurNom: string | null;
  dateValidation: string | null;
  commentaireValidation: string | null;
  motifs: MotifRefusResponse[];
}

export interface LotDecisionResponse {
  lotId: number;
  lotNumero: number;
  lotObjet: string;
}

export interface ParticipationDecisionResponse {
  id: number;
  decision: DecisionParticipation;
  dateDecision: string;
  groupeId: string;
  justificationText: string;
  decideurNom: string;
  statutValidation: StatutValidation;
  validateurNom: string | null;
  dateValidation: string | null;
  commentaireValidation: string | null;
  lots: LotDecisionResponse[];
  motifs: MotifRefusResponse[];
}

// ─── Responses ───
export interface LotResponse {
  id: number;
  numero: number;
  objet: string;
  budgetEstimatif: number;
  cautionnementProvisoire: number;
  etatAvancement: string | null;
  resultat: string | null;
  dateResultat: string | null;
  montantAttribue: number | null;
  createdAt: string;
  decision?: DecisionSummaryResponse;
}

export interface AttributDynamiqueResponse {
  key: string;
  value: string;
}

export interface DocumentAoResponse {
  id: number;
  typeDocumentAo: TypeDocumentAo;
  nom: string;
  downloadUrl: string;
  uploadedByNom: string;
  dateUpload: string;
}

export interface AppelOffreResponse {
  id: number;
  reference: string;
  objet: string;
  dateOuverture: string;
  dateLimiteDepot: string;
  budgetEstimatif: number;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  clientNom: string;
  responsableNom: string;
  natureMarche: NatureMarche;
  modePassation: ModePassation;
  appelOffreType: AppelOffreType;
  etatGlobal: EtatGlobal;
  multilot: boolean;
  lots: LotResponse[];
  documents: DocumentAoResponse[];
  attributsDynamiques: AttributDynamiqueResponse[];
}

export interface AppelOffreSummaryResponse {
  id: number;
  reference: string;
  appelOffreType: AppelOffreType;
  modePassation: ModePassation;
  natureMarche: NatureMarche;
  objet: string;
  dateOuverture: string;
  dateLimiteDepot: string;
  budgetEstimatif: number;
  currencyCode: string;
  currencySymbol: string;
  clientNom: string;
  responsableNom: string;
  etatGlobal: EtatGlobal | null;
  multilot: boolean;
  nombreLots: number;
}

export interface HistoriqueResponse {
  id: number;
  typeEntite: TypeEntite;
  entiteId: number;
  actionType: TypeAction;
  utilisateurNom: string;
  dateAction: string;
  description: string;
}

// ─── Lookup responses ───
export interface ClientResponse {
  id: number;
  clientName: string;
  adresse: string;
  email: string;
  telephone: string;
  secteur: TypeSecteur;
}

// ─── Pagination ───
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
  last?: boolean;
}

// ─── Filters ───
export interface AOFilterValues {
  natureMarche: NatureMarche | '';
  dateLimiteDepot: string;
  budgetMin: number | null;
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

// ─── Label maps ───
export const MODE_PASSATION_LABELS: Record<ModePassation, string> = {
  OUVERT: 'Ouvert',
  RESTREINT: 'Restreint',
  CONSULTATION: 'Consultation',
};

export const NATURE_MARCHE_LABELS: Record<NatureMarche, string> = {
  PUBLIC: 'Public',
  PRIVE: 'Privé',
};

export const ETAT_GLOBAL_LABELS: Record<EtatGlobal, string> = {
  BROUILLON: 'Brouillon',
  PUBLIE: 'Publié',
  EN_COURS: 'En cours',
  CLOTURE: 'Clôturé',
  ANNULE: 'Annulé',
  ATTRIBUE: 'Attribué',
};

export const TYPE_AO_LABELS: Record<AppelOffreType, string> = {
  NATIONAL: 'National',
  INTERNATIONAL: 'International',
};

export const TYPE_DOCUMENT_LABELS: Record<TypeDocumentAo, string> = {
  CAHIER_DES_CHARGES: 'Cahier des charges',
  REGLEMENT_DE_CONSULTATION: 'Règlement de consultation',
  ANNEXE: 'Annexe',
  MODELE_DE_SOUMISSION: 'Modèle de soumission',
  AVIS: 'Avis',
  AUTRE: 'Autre',
};

export const DECISION_LABELS: Record<DecisionParticipation, string> = {
  GO: 'Go',
  NO_GO: 'No Go',
};

export const STATUT_VALIDATION_LABELS: Record<StatutValidation, string> = {
  SOUMISE: 'Soumise',
  VALIDEE: 'Validée',
  REJETEE: 'Rejetée',
};

export const CATEGORIE_MOTIF_LABELS: Record<CategorieMotif, string> = {
  TECHNIQUE: 'Technique',
  FINANCIER: 'Financier',
  ADMINISTRATIF: 'Administratif',
  JURIDIQUE: 'Juridique',
  CAPACITE_INTERNE: 'Capacité interne',
  AUTRE: 'Autre',
};
