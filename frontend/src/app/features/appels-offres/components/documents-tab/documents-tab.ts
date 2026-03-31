import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { finalize } from 'rxjs';
import { DocumentsAoService } from '../../services/documents-ao.service';
import {
  DocumentAoResponse,
  TypeDocumentAo,
  TYPE_DOCUMENT_LABELS,
} from '../../models/appel-offre.model';
import { AppelsOffresStore } from '../../store/appels-offres.store';

@Component({
  selector: 'app-documents-tab',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './documents-tab.html',
  styleUrl: './documents-tab.css',
})
export class DocumentsTabComponent {
  aoId = input.required<number>();
  documents = input.required<DocumentAoResponse[]>();

  private readonly docService = inject(DocumentsAoService);
  private readonly store = inject(AppelsOffresStore);

  readonly typeLabels = TYPE_DOCUMENT_LABELS;
  readonly docTypes: TypeDocumentAo[] = [
    'CAHIER_DES_CHARGES',
    'REGLEMENT_DE_CONSULTATION',
    'ANNEXE',
    'MODELE_DE_SOUMISSION',
    'AVIS',
    'AUTRE',
  ];

  readonly showUpload = signal(false);
  readonly uploading = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly selectedType = signal<TypeDocumentAo>('AUTRE');

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile.set(input.files[0]);
    }
  }

  upload(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.docService
      .upload(this.aoId(), file, {
        typeDocumentAo: this.selectedType(),
        nom: file.name,
      })
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: () => {
          this.showUpload.set(false);
          this.selectedFile.set(null);
          this.store.refreshDetail();
        },
      });
  }

  download(doc: DocumentAoResponse): void {
    this.docService.download(this.aoId(), doc.id).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.nom;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr));
  }
}
