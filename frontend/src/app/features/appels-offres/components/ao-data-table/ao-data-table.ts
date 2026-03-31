import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppelOffreSummaryResponse } from '../../models/appel-offre.model';
import { AORow } from '../ao-row/ao-row';

@Component({
  selector: 'app-ao-data-table',
  standalone: true,
  imports: [AORow, MatIconModule],
  templateUrl: './ao-data-table.html',
  styleUrl: './ao-data-table.css',
})
export class AODataTable {
  data = input.required<AppelOffreSummaryResponse[]>();
  viewAO = output<AppelOffreSummaryResponse>();
  editAO = output<AppelOffreSummaryResponse>();
  deleteAO = output<AppelOffreSummaryResponse>();
}
