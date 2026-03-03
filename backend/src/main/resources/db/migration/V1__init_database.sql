CREATE TABLE role (
id INT AUTO_INCREMENT PRIMARY KEY,
nom VARCHAR(50) NOT NULL UNIQUE,
description VARCHAR(255)
);

CREATE TABLE utilisateur (
id INT AUTO_INCREMENT PRIMARY KEY,
nom VARCHAR(100) NOT NULL,
prenom VARCHAR(100) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(500) NOT NULL,
telephone VARCHAR(20),
created_at DATETIME(6) NOT NULL
);

CREATE TABLE client (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
client_name VARCHAR(255) NOT NULL,
adresse VARCHAR(255),
email VARCHAR(255) UNIQUE,
telephone VARCHAR(20),
secteur VARCHAR(50),
created_at DATETIME(6) NOT NULL
);

CREATE TABLE type_notification (
id INT AUTO_INCREMENT PRIMARY KEY,
code VARCHAR(255),
libelle VARCHAR(255),
description VARCHAR(255),
template_sujet VARCHAR(255),
template_corps VARCHAR(255),
canal_defaut VARCHAR(50)
);

CREATE TABLE motif_refus (
id INT AUTO_INCREMENT PRIMARY KEY,
libelle VARCHAR(255) NOT NULL,
categorie VARCHAR(50) NOT NULL
);

CREATE TABLE type_document_requis (
id INT AUTO_INCREMENT PRIMARY KEY,
nom VARCHAR(255) NOT NULL,
categorie VARCHAR(50) NOT NULL,
est_eliminatoire_par_defaut BIT(1) NOT NULL
);

CREATE TABLE extension_entite (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
type_entite INT,
entity_id BIGINT,
`key` VARCHAR(255),
`value` VARCHAR(255),
type_attribut INT
);

CREATE TABLE dossier_soumission (
id INT AUTO_INCREMENT PRIMARY KEY,
date_soumission DATE,
created_at DATETIME(6) NOT NULL,
date_derniere_relance DATE,
status_validation VARCHAR(50) NOT NULL
);

CREATE TABLE fichier_physique (
id INT AUTO_INCREMENT PRIMARY KEY,
path VARCHAR(500) NOT NULL,
nom_original VARCHAR(255) NOT NULL,
content_hash VARCHAR(64) NOT NULL,
uploaded_by INT,
created_at DATETIME(6) NOT NULL,
CONSTRAINT fk_fichier_physique_uploaded_by
FOREIGN KEY (uploaded_by) REFERENCES utilisateur(id)
);

CREATE TABLE user_roles (
user_id INT NOT NULL,
role_id INT NOT NULL,
PRIMARY KEY (user_id, role_id),
CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES utilisateur(id),
CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE document_entreprise (
id INT AUTO_INCREMENT PRIMARY KEY,
id_type_document INT NOT NULL,
id_fichier_courant INT,
libelle VARCHAR(255),
mis_a_jour_par INT,
created_at DATETIME(6) NOT NULL,
updated_at DATETIME(6) NOT NULL,
CONSTRAINT fk_document_entreprise_type FOREIGN KEY (id_type_document) REFERENCES type_document_requis(id),
CONSTRAINT fk_document_entreprise_fichier FOREIGN KEY (id_fichier_courant) REFERENCES fichier_physique(id),
CONSTRAINT fk_document_entreprise_mis_a_jour_par FOREIGN KEY (mis_a_jour_par) REFERENCES utilisateur(id)
);

CREATE TABLE appel_offre (
id INT AUTO_INCREMENT PRIMARY KEY,
reference VARCHAR(20) NOT NULL UNIQUE,
type_ao VARCHAR(50) NOT NULL,
mode_passation VARCHAR(50) NOT NULL,
objet VARCHAR(500) NOT NULL,
date_ouverture DATE NOT NULL,
date_limite_depot DATE NOT NULL,
adresse_reception VARCHAR(255) NOT NULL,
nature_marche VARCHAR(50) NOT NULL,
budget_estimatif DECIMAL(15,2),
responsable_id INT NOT NULL,
possibilite_groupement BIT(1) NOT NULL,
client_id BIGINT NOT NULL,
created_at DATETIME(6) NOT NULL,
CONSTRAINT fk_appel_offre_responsable FOREIGN KEY (responsable_id) REFERENCES utilisateur(id),
CONSTRAINT fk_appel_offre_client FOREIGN KEY (client_id) REFERENCES client(id)
);

CREATE TABLE lot (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
ao_id INT NOT NULL,
numero INT NOT NULL,
objet VARCHAR(500) NOT NULL,
budget_estimatif DECIMAL(15,2),
etat_avancement VARCHAR(50),
resultat VARCHAR(50) NOT NULL,
date_resultat DATE,
montant_attribue DECIMAL(15,2),
cautionnement_provisoire DECIMAL(15,2),
created_at DATETIME(6) NOT NULL,
CONSTRAINT fk_lot_ao FOREIGN KEY (ao_id) REFERENCES appel_offre(id)
);

CREATE TABLE document_ao (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
id_ao INT NOT NULL,
type_document_ao VARCHAR(50) NOT NULL,
nom VARCHAR(255) NOT NULL,
path VARCHAR(500) NOT NULL,
uploaded_by INT,
date_upload DATETIME,
CONSTRAINT fk_document_ao_ao FOREIGN KEY (id_ao) REFERENCES appel_offre(id),
CONSTRAINT fk_document_ao_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES utilisateur(id)
);

CREATE TABLE contrat (
id INT AUTO_INCREMENT PRIMARY KEY,
date_debut DATE NOT NULL,
date_fin DATE NOT NULL,
date_signature TIME,
montant DECIMAL(15,2) NOT NULL,
responsable_suivi_id INT NOT NULL,
contrat_status VARCHAR(50),
created_at DATETIME(6) NOT NULL,
CONSTRAINT fk_contrat_responsable FOREIGN KEY (responsable_suivi_id) REFERENCES utilisateur(id)
);

CREATE TABLE avenant (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
id_contrat INT NOT NULL,
date_signature DATETIME,
date_effet TIME,
created_at DATETIME(6) NOT NULL,
CONSTRAINT fk_avenant_contrat FOREIGN KEY (id_contrat) REFERENCES contrat(id)
);

CREATE TABLE document_contrat (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
contrat_id INT NOT NULL,
id_avenant BIGINT,
type_doc VARCHAR(50) NOT NULL,
nom VARCHAR(255) NOT NULL,
path VARCHAR(255),
uploaded_by INT,
date_upload DATETIME NOT NULL,
CONSTRAINT fk_document_contrat_contrat FOREIGN KEY (contrat_id) REFERENCES contrat(id),
CONSTRAINT fk_document_contrat_avenant FOREIGN KEY (id_avenant) REFERENCES avenant(id),
CONSTRAINT fk_document_contrat_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES utilisateur(id)
);

CREATE TABLE contrat_lot (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
id_contrat INT NOT NULL,
id_lot BIGINT NOT NULL,
montant_lot DECIMAL(15,2),
CONSTRAINT fk_contrat_lot_contrat FOREIGN KEY (id_contrat) REFERENCES contrat(id),
CONSTRAINT fk_contrat_lot_lot FOREIGN KEY (id_lot) REFERENCES lot(id)
);

CREATE TABLE echeance (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
id_contrat INT NOT NULL,
type_echeance VARCHAR(50) NOT NULL,
status_echeance VARCHAR(50) NOT NULL,
date_echeance DATE,
jour_alerte_avant INT NOT NULL,
alerte_envoye BIT(1) NOT NULL,
date_alerte_envoye DATETIME(6),
CONSTRAINT fk_echeance_contrat FOREIGN KEY (id_contrat) REFERENCES contrat(id)
);

CREATE TABLE engagement_contractuel (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
contrat_id INT NOT NULL,
type_engagement VARCHAR(50) NOT NULL,
description TEXT,
status VARCHAR(50) NOT NULL,
date_echeance DATE,
date_realisation DATE,
CONSTRAINT fk_engagement_contrat FOREIGN KEY (contrat_id) REFERENCES contrat(id)
);

CREATE TABLE participation_decision (
id INT AUTO_INCREMENT PRIMARY KEY,
decision VARCHAR(50) NOT NULL,
lot_id BIGINT NOT NULL,
date_decision DATE NOT NULL,
justification_text TEXT NOT NULL,
decideur_id INT NOT NULL,
CONSTRAINT fk_participation_decision_lot FOREIGN KEY (lot_id) REFERENCES lot(id),
CONSTRAINT fk_participation_decision_decideur FOREIGN KEY (decideur_id) REFERENCES utilisateur(id)
);

CREATE TABLE participation_motif (
id INT AUTO_INCREMENT PRIMARY KEY,
id_decision INT NOT NULL,
id_motif_refus INT NOT NULL,
commentaire TEXT,
CONSTRAINT fk_participation_motif_decision FOREIGN KEY (id_decision) REFERENCES participation_decision(id),
CONSTRAINT fk_participation_motif_motif FOREIGN KEY (id_motif_refus) REFERENCES motif_refus(id)
);

CREATE TABLE lot_motif_echec (
id INT AUTO_INCREMENT PRIMARY KEY,
id_lot BIGINT NOT NULL,
id_motif_refus INT NOT NULL,
commentaire TEXT,
CONSTRAINT fk_lot_motif_echec_lot FOREIGN KEY (id_lot) REFERENCES lot(id),
CONSTRAINT fk_lot_motif_echec_motif FOREIGN KEY (id_motif_refus) REFERENCES motif_refus(id)
);

CREATE TABLE document_soumission (
id INT AUTO_INCREMENT PRIMARY KEY,
id_dossier INT NOT NULL,
est_eliminatoire BIT(1) NOT NULL,
est_demande BIT(1) NOT NULL,
est_fourni BIT(1) NOT NULL,
CONSTRAINT fk_document_soumission_dossier FOREIGN KEY (id_dossier) REFERENCES dossier_soumission(id)
);

CREATE TABLE notification (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
id_type_notification INT,
destinataire_id INT NOT NULL,
sujet VARCHAR(500) NOT NULL,
message TEXT NOT NULL,
status VARCHAR(50),
date_creation DATETIME NOT NULL,
date_envoi DATETIME,
type_entite INT,
entite_id BIGINT,
lu BIT(1) NOT NULL,
CONSTRAINT fk_notification_type FOREIGN KEY (id_type_notification) REFERENCES type_notification(id),
CONSTRAINT fk_notification_destinataire FOREIGN KEY (destinataire_id) REFERENCES utilisateur(id)
);

CREATE TABLE historique (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
type_entite INT,
entite_id BIGINT,
action_type INT,
utilisateur_id INT,
date_action DATETIME NOT NULL,
description TEXT,
CONSTRAINT fk_historique_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id)
);

CREATE TABLE refresh_token (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
token VARCHAR(255) UNIQUE,
user_id INT,
expiry_date DATETIME(6),
CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES utilisateur(id)
);