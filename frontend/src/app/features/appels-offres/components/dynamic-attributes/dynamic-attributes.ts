import { Component, input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ExtraFieldGroup {
  key: FormControl<string>;
  value: FormControl<string>;
}

@Component({
  selector: 'app-dynamic-attributes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './dynamic-attributes.html',
  styleUrl: './dynamic-attributes.css',
})
export class DynamicAttributesComponent {
  formArray = input.required<FormArray<FormGroup<ExtraFieldGroup>>>();

  constructor(private readonly fb: FormBuilder) {}

  addField(): void {
    this.formArray().push(
      this.fb.group<ExtraFieldGroup>({
        key: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        value: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      }),
    );
  }

  removeField(index: number): void {
    this.formArray().removeAt(index);
  }

  getGroup(index: number): FormGroup<ExtraFieldGroup> {
    return this.formArray().at(index);
  }
}
