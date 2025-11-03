import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../../../core/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  standalone: true,
  imports: [CommonModule]
})
export class Spinner {
  loading$;

  constructor(private spinnerService: SpinnerService) {
    this.loading$ = this.spinnerService.loading$;
  }
}
