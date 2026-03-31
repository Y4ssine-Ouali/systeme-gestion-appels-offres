import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, MatCardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly stats = [
    {
      label: "Appels d'offres actifs",
      value: '12',
      icon: 'campaign',
      color: '#017e84',
      bg: '#e6f7f7',
    },
    {
      label: 'Soumissions en cours',
      value: '5',
      icon: 'folder_shared',
      color: '#8b5cf6',
      bg: '#f5f3ff',
    },
    {
      label: 'Contrats signés',
      value: '28',
      icon: 'description',
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      label: 'Échéances proches',
      value: '3',
      icon: 'event_note',
      color: '#f59e0b',
      bg: '#fffbeb',
    },
  ];
}