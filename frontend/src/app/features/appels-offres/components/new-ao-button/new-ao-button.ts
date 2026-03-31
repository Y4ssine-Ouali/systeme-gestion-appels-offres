import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-ao-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './new-ao-button.html',
  styleUrl: './new-ao-button.css',
})
export class NewAOButton {
  clicked = output();
}
